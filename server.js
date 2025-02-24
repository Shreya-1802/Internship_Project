const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

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
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

// Start server with error handling and port fallback
const startServer = async () => {
  try {
    await handleDisconnect();
    
    const startPort = process.env.PORT || 5000;
    let currentPort = startPort;
    let maxAttempts = 10;
    let server;

    while (maxAttempts > 0) {
      try {
        server = app.listen(currentPort);
        console.log(`Server running on port ${currentPort}`);
        console.log('Database connection pool initialized successfully');
        break;
      } catch (err) {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${currentPort} is in use, trying port ${currentPort + 1}`);
          currentPort++;
          maxAttempts--;
        } else {
          throw err;
        }
      }
    }

    if (maxAttempts === 0) {
      throw new Error('Could not find an available port after multiple attempts');
    }

    // Update client configuration if port changed
    if (currentPort !== startPort) {
      console.log(`Note: Server is running on a different port than default. Please update your client configuration if needed.`);
    }

  } catch (error) {
    console.error('Failed to start server:', error);
    // In production (Vercel), we don't want to exit the process
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Handle uncaught exceptions without exiting in production
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

startServer(); 