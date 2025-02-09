const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
};

async function setupDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database');

        // Create courses table if it doesn't exist
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS courses (
                id INT PRIMARY KEY AUTO_INCREMENT,
                trimester INT NOT NULL,
                name VARCHAR(255) NOT NULL
            )
        `);
        console.log('Courses table created or already exists');

        // Check if courses table is empty
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM courses');
        if (rows[0].count === 0) {
            // Insert sample courses
            await connection.execute(`
                INSERT INTO courses (trimester, name) VALUES 
                (1, 'Introduction to Computer Science'),
                (1, 'Data Structures and Algorithms'),
                (2, 'Database Management'),
                (2, 'Web Development'),
                (3, 'Artificial Intelligence')
            `);
            console.log('Sample courses inserted');
        } else {
            console.log('Courses table already has data, skipping sample data insertion');
        }

        await connection.end();
        console.log('Database setup completed');
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
}

setupDatabase();