const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
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
    let connection;
    try {
        // Create connection
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database');

        // Check if courses table has data
        const [existingCourses] = await connection.execute('SELECT COUNT(*) as count FROM courses');
        
        if (existingCourses[0].count === 0) {
            // If table is empty, insert sample courses
            const courses = [
                ['Introduction to Programming', 1],
                ['Data Structures and Algorithms', 1],
                ['Database Systems', 2],
                ['Web Development', 2],
                ['Artificial Intelligence', 3],
                ['Operating Systems', 2],
                ['Computer Networks', 2],
                ['Software Engineering', 3],
                ['Mobile App Development', 3],
                ['Cloud Computing', 3]
            ];

            // Insert courses one by one to handle any potential errors
            for (const [name, trimester] of courses) {
                try {
                    await connection.execute(
                        'INSERT INTO courses (name, trimester) VALUES (?, ?)',
                        [name, trimester]
                    );
                    console.log(`Added course: ${name}`);
                } catch (err) {
                    console.warn(`Warning: Could not add course ${name}: ${err.message}`);
                }
            }
            
            console.log('Sample courses inserted successfully');
        } else {
            console.log('Courses table already has data, skipping sample data insertion');
        }

        // Verify courses
        const [courses] = await connection.execute('SELECT * FROM courses ORDER BY trimester, name');
        console.log(`\nCurrent courses in database (${courses.length} total):`);
        courses.forEach(course => {
            console.log(`- ${course.name} (Trimester ${course.trimester})`);
        });

    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

setupDatabase();