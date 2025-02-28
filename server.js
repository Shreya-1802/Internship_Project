const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const feedbackRoutes = require('./routes/feedback');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 30000,
  ssl: {
    rejectUnauthorized: false
  }
});

// Handle database connection with improved error handling
const handleDisconnect = () => {
  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        console.error('Error connecting to MySQL:', err);
        // In production, we want to retry connection
        if (process.env.NODE_ENV === 'production') {
          setTimeout(() => handleDisconnect().then(resolve).catch(reject), 2000);
        } else {
          reject(err);
        }
      } else {
        console.log('Connected to MySQL database');
        resolve();
      }
    });

    db.on('error', (err) => {
      console.error('Database error:', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        handleDisconnect().then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
};

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health Check API
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await new Promise((resolve, reject) => {
      db.query('SELECT 1', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        server: 'up',
        database: 'connected',
        geminiAI: genAI ? 'initialized' : 'not initialized'
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        server: 'up',
        database: 'disconnected',
        geminiAI: genAI ? 'initialized' : 'not initialized'
      },
      error: process.env.NODE_ENV === 'production' ? 'Service unavailable' : error.message,
      environment: process.env.NODE_ENV || 'development'
    });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/feedback', feedbackRoutes);
app.use('/api/dashboard', require('./routes/dashboard'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something broke!',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server function
const startServer = async (port) => {
  try {
    await handleDisconnect();
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error('Server error:', err);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start server on initial port
const PORT = process.env.PORT || 5000;
startServer(PORT); 