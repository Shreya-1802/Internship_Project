const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function insertSampleData() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Connected to database');

    // Insert sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = [
      ['John Smith', 'john.smith@example.com', hashedPassword, 'student'],
      ['Dr. Sarah Wilson', 'sarah.wilson@example.com', hashedPassword, 'faculty'],
      ['Mike Johnson', 'mike.johnson@example.com', hashedPassword, 'alumni'],
      ['Mary Brown', 'mary.brown@example.com', hashedPassword, 'parent'],
      ['Emma Davis', 'emma.davis@example.com', hashedPassword, 'student'],
      ['Prof. James Lee', 'james.lee@example.com', hashedPassword, 'faculty']
    ];

    const [userResults] = await connection.query(
      'INSERT INTO users (name, email, password, role) VALUES ?',
      [users]
    );

    console.log('Sample users inserted');

    // Insert sample courses
    const courses = [
      ['Introduction to Programming', 1],
      ['Data Structures and Algorithms', 1],
      ['Database Systems', 2],
      ['Web Development', 2],
      ['Artificial Intelligence', 3]
    ];

    const [courseResults] = await connection.query(
      'INSERT INTO courses (name, trimester) VALUES ?',
      [courses]
    );

    console.log('Sample courses inserted');

    // Insert sample feedback
    for (let i = 1; i <= 6; i++) { // For each user
      for (let j = 1; j <= 5; j++) { // For each course
        // Insert general feedback
        const [feedbackResult] = await connection.execute(
          'INSERT INTO feedback (stakeholder_id, course_id, rating, comments) VALUES (?, ?, ?, ?)',
          [i, j, Math.floor(Math.random() * 3) + 3, // Random rating between 3-5
           'This is sample feedback for testing purposes.']
        );

        const feedbackId = feedbackResult.insertId;

        // Insert role-specific feedback based on user role
        switch (users[i-1][3]) { // Get user role
          case 'student':
            await connection.execute(`
              INSERT INTO student_feedback (
                feedback_id, teaching_quality, practical_application, course_difficulty,
                content_depth, assignment_quality, peer_learning, resources_quality,
                doubt_resolution, instructor_expertise, lab_equipment, course_pace,
                understanding_level, career_alignment
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              feedbackId,
              Math.floor(Math.random() * 3) + 3, // Random ratings between 3-5
              Math.floor(Math.random() * 3) + 3,
              'Moderate',
              Math.floor(Math.random() * 3) + 3,
              Math.floor(Math.random() * 3) + 3,
              Math.floor(Math.random() * 3) + 3,
              Math.floor(Math.random() * 3) + 3,
              'Quick',
              Math.floor(Math.random() * 3) + 3,
              Math.floor(Math.random() * 3) + 3,
              'Perfect',
              Math.floor(Math.random() * 3) + 3,
              Math.floor(Math.random() * 3) + 3
            ]);
            break;

          case 'faculty':
            await connection.execute(`
              INSERT INTO teacher_feedback (
                feedback_id, lab_facilities, curriculum_flexibility, class_strength,
                teaching_aids, attendance_rate, student_progress, student_interaction,
                syllabus_coverage
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              feedbackId,
              Math.floor(Math.random() * 3) + 3,
              Math.floor(Math.random() * 3) + 3,
              Math.floor(Math.random() * 3) + 3,
              Math.floor(Math.random() * 3) + 3,
              Math.floor(Math.random() * 3) + 3,
              Math.floor(Math.random() * 3) + 3,
              Math.floor(Math.random() * 3) + 3,
              Math.floor(Math.random() * 3) + 3
            ]);
            break;

          case 'alumni':
            await connection.execute(`
              INSERT INTO alumni_feedback (
                feedback_id, industry_relevance, career_growth, salary_impact,
                knowledge_retention, networking_value, current_role, course_application
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              feedbackId,
              Math.floor(Math.random() * 3) + 3,
              Math.floor(Math.random() * 3) + 3,
              'High',
              Math.floor(Math.random() * 3) + 3,
              Math.floor(Math.random() * 3) + 3,
              'Software Engineer',
              'Often'
            ]);
            break;

          case 'parent':
            await connection.execute(`
              INSERT INTO parent_feedback (
                feedback_id, academic_improvement, overall_satisfaction,
                faculty_communication, fee_structure, concerns
              ) VALUES (?, ?, ?, ?, ?, ?)
            `, [
              feedbackId,
              Math.floor(Math.random() * 3) + 3,
              Math.floor(Math.random() * 3) + 3,
              Math.floor(Math.random() * 3) + 3,
              Math.floor(Math.random() * 3) + 3,
              'Minor Concerns'
            ]);
            break;
        }
      }
    }

    console.log('Sample feedback inserted');
    console.log('All sample data inserted successfully');

    await connection.end();
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
}

insertSampleData(); 