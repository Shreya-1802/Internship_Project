const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { courses } = require('./course');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 30000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

// Get all courses grouped by trimester
router.get('/courses', async (req, res) => {
  try {
    // Convert courses object to array format expected by frontend
    const formattedCourses = [];
    for (const [trimester, trimesterCourses] of Object.entries(courses)) {
      for (const [courseName, courseInfo] of Object.entries(trimesterCourses)) {
        formattedCourses.push({
          id: courseName,
          name: courseName,
          trimester: parseInt(trimester.replace('Trimester ', '')),
          credits: courseInfo.credits,
          description: courseInfo.description
        });
      }
    }
    
    res.json(formattedCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ 
      message: 'Error fetching courses',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get courses by trimester
router.get('/courses/:trimester', async (req, res) => {
  const { trimester } = req.params;
  try {
    const trimesterKey = `Trimester ${trimester}`;
    const trimesterCourses = courses[trimesterKey] || {};
    
    const formattedCourses = Object.entries(trimesterCourses).map(([courseName, courseInfo]) => ({
      id: courseName,
      name: courseName,
      trimester: parseInt(trimester),
      credits: courseInfo.credits,
      description: courseInfo.description
    }));
    
    res.json(formattedCourses);
  } catch (error) {
    console.error('Error fetching trimester courses:', error);
    res.status(500).json({ 
      message: 'Error fetching trimester courses',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get course by ID
router.get('/course/:id', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await pool.getConnection();
    const [courses] = await connection.execute(
      'SELECT * FROM courses WHERE id = ?',
      [id]
    );
    
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(courses[0]);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ 
      message: 'Error fetching course',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    if (connection) connection.release();
  }
});

// Get feedback form fields based on role
router.get('/fields/:role', async (req, res) => {
  const { role } = req.params;
  
  const fields = {
    student: [
      { name: 'teaching_quality', label: 'Teaching Effectiveness', type: 'rating' },
      { name: 'practical_application', label: 'Hands-on Learning Experience', type: 'rating' },
      { name: 'course_difficulty', label: 'Course Difficulty Level', type: 'select', 
        options: ['Too Easy', 'Easy', 'Moderate', 'Challenging', 'Very Challenging'] },
      { name: 'content_depth', label: 'Depth of Course Content', type: 'rating' },
      { name: 'resources_quality', label: 'Study Materials Quality', type: 'rating' },
      { name: 'doubt_resolution', label: 'Doubt Resolution Speed', type: 'select',
        options: ['Very Slow', 'Slow', 'Average', 'Quick', 'Very Quick'] },
      { name: 'instructor_expertise', label: 'Instructor Subject Expertise', type: 'rating' }
    ],
    faculty: [
      { name: 'lab_facilities', label: 'Laboratory Infrastructure', type: 'rating' },
      { name: 'curriculum_flexibility', label: 'Curriculum Adaptability', type: 'rating' },
      { name: 'teaching_aids', label: 'Teaching Aids Availability', type: 'rating' },
      { name: 'attendance_rate', label: 'Student Attendance Rate', type: 'rating' },
      { name: 'student_progress', label: 'Overall Class Progress', type: 'rating' },
      { name: 'student_interaction', label: 'Student Interaction Level', type: 'rating' }
    ],
    alumni: [
      { name: 'industry_relevance', label: 'Industry Relevance', type: 'rating' },
      { name: 'career_growth', label: 'Career Growth Impact', type: 'rating' },
      { name: 'salary_impact', label: 'Course Impact on Salary', type: 'select',
        options: ['No Impact', 'Low', 'Moderate', 'High', 'Very High'] },
      { name: 'knowledge_retention', label: 'Knowledge Retention', type: 'rating' },
      { name: 'networking_value', label: 'Professional Network Value', type: 'rating' },
      { name: 'current_role', label: 'Current Job Role', type: 'text' },
      { name: 'course_application', label: 'Course Knowledge Application Frequency', type: 'select',
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] }
    ],
    parent: [
      { name: 'academic_improvement', label: 'Academic Performance', type: 'rating' },
      { name: 'overall_satisfaction', label: 'Overall Satisfaction', type: 'rating' },
      { name: 'faculty_communication', label: 'Faculty Communication', type: 'rating' },
      { name: 'fee_structure', label: 'Value for Money', type: 'rating' },
      { name: 'concerns', label: 'Any Concerns?', type: 'select',
        options: ['No Concerns', 'Minor Concerns', 'Moderate Concerns', 'Major Concerns'] }
    ]
  };

  res.json(fields[role] || []);
});

// Submit feedback
router.post('/submit', async (req, res) => {
  let { userId, courseId, rating, comments, role, ...roleSpecificData } = req.body;
  let connection;
  
  try {
    // Validate required fields
    if (!userId || !courseId || !rating || !role) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: 'userId, courseId, rating, and role are required'
      });
    }

    role = role.toLowerCase();
    if (role === 'teacher') role = 'faculty';

    // Validate role
    if (!['student', 'faculty', 'alumni', 'parent'].includes(role)) {
      return res.status(400).json({ 
        message: 'Invalid role',
        details: 'Role must be one of: student, faculty, alumni, parent'
      });
    }

    // Extract course code if courseId contains name
    const courseCode = courseId.includes(' - ') ? courseId.split(' - ')[0].trim() : courseId;

    console.log('Searching for course:', courseCode, 'Full courseId:', courseId);

    // Verify course exists in courses.js
    let foundCourse = null;
    for (const [trimester, trimesterCourses] of Object.entries(courses)) {
      // Try to find the course by full name or code
      const matchingCourse = Object.entries(trimesterCourses).find(([courseName]) => {
        // Check if the course name matches exactly
        if (courseName === courseId) return true;
        // Check if the course code matches the start of the course name
        if (courseName.startsWith(courseCode)) return true;
        // Check if the course name contains the course code
        if (courseName.includes(courseCode)) return true;
        return false;
      });
      
      if (matchingCourse) {
        const [courseName, courseInfo] = matchingCourse;
        foundCourse = {
          code: courseCode,
          name: courseName,
          ...courseInfo,
          trimester: parseInt(trimester.replace('Trimester ', ''))
        };
        console.log('Found matching course:', courseName);
        break;
      }
    }

    if (!foundCourse) {
      console.log('Course not found. Available courses:', 
        Object.entries(courses).map(([trim, courses]) => 
          `${trim}: ${Object.keys(courses).join(', ')}`
        ).join('\n')
      );
      return res.status(404).json({
        message: 'Course not found',
        details: `Course ${courseId} not found in the course list`
      });
    }

    console.log('Found course details:', foundCourse);

    connection = await pool.getConnection();
    
    // Start transaction
    await connection.beginTransaction();

    // First, check if user exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    let dbUserId;
    if (existingUsers.length === 0) {
      // User doesn't exist, create new user
      const [insertUserResult] = await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Anonymous User', `user${userId}@example.com`, 'defaultpass', role]
      );
      dbUserId = insertUserResult.insertId;
      console.log('Created new user with ID:', dbUserId);
    } else {
      dbUserId = existingUsers[0].id;
    }

    // Check if course exists in database, if not insert it
    const [existingCourses] = await connection.execute(
      'SELECT id FROM courses WHERE code = ?',
      [foundCourse.code]
    );

    let dbCourseId;
    if (existingCourses.length === 0) {
      // Insert the course into database
      const [insertResult] = await connection.execute(
        'INSERT INTO courses (name, code, description) VALUES (?, ?, ?)',
        [foundCourse.name, foundCourse.code, foundCourse.description || '']
      );
      dbCourseId = insertResult.insertId;
    } else {
      dbCourseId = existingCourses[0].id;
    }
    
    // Insert feedback using the verified user ID
    const [result] = await connection.execute(
      'INSERT INTO feedback (user_id, course_id, rating, comments, role) VALUES (?, ?, ?, ?, ?)',
      [dbUserId, dbCourseId, rating, comments || '', role]
    );
    
    const feedbackId = result.insertId;

    // Insert role-specific feedback based on role
    switch (role) {
      case 'student':
        await connection.execute(
          `INSERT INTO student_feedback (
            feedback_id, teaching_quality, practical_application, course_difficulty,
            content_depth, resources_quality, doubt_resolution, instructor_expertise
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            feedbackId,
            roleSpecificData.teaching_quality || null,
            roleSpecificData.practical_application || null,
            roleSpecificData.course_difficulty || null,
            roleSpecificData.content_depth || null,
            roleSpecificData.resources_quality || null,
            roleSpecificData.doubt_resolution || null,
            roleSpecificData.instructor_expertise || null
          ]
        );
        break;

      case 'faculty':
        await connection.execute(
          `INSERT INTO teacher_feedback (
            feedback_id, lab_facilities, curriculum_flexibility,
            teaching_aids, attendance_rate, student_progress, 
            student_interaction, syllabus_coverage
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            feedbackId,
            roleSpecificData.lab_facilities || null,
            roleSpecificData.curriculum_flexibility || null,
            roleSpecificData.teaching_aids || null,
            roleSpecificData.attendance_rate || null,
            roleSpecificData.student_progress || null,
            roleSpecificData.student_interaction || null,
            roleSpecificData.syllabus_coverage || null
          ]
        );
        break;

      case 'alumni':
        await connection.execute(
          `INSERT INTO alumni_feedback (
            feedback_id, industry_relevance, career_growth, salary_impact,
            knowledge_retention, networking_value, current_role, course_application
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            feedbackId,
            roleSpecificData.industry_relevance || null,
            roleSpecificData.career_growth || null,
            roleSpecificData.salary_impact || null,
            roleSpecificData.knowledge_retention || null,
            roleSpecificData.networking_value || null,
            roleSpecificData.current_role || null,
            roleSpecificData.course_application || null
          ]
        );
        break;

      case 'parent':
        await connection.execute(
          `INSERT INTO parent_feedback (
            feedback_id, academic_improvement, overall_satisfaction,
            faculty_communication, fee_structure, concerns
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            feedbackId,
            roleSpecificData.academic_improvement || null,
            roleSpecificData.overall_satisfaction || null,
            roleSpecificData.faculty_communication || null,
            roleSpecificData.fee_structure || null,
            roleSpecificData.concerns || null
          ]
        );
        break;
    }

    // Commit transaction
    await connection.commit();

    res.status(201).json({ 
      message: 'Feedback submitted successfully',
      feedbackId,
      course: foundCourse
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error submitting feedback:', error);
    res.status(500).json({ 
      message: 'Error submitting feedback',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    if (connection) connection.release();
  }
});

// Get course feedback
router.get('/course/:courseId', async (req, res) => {
  const { courseId } = req.params;

  try {
    const connection = await pool.getConnection();

    // Get course details
    const [course] = await connection.execute(
      'SELECT * FROM courses WHERE id = ?',
      [courseId]
    );

    // Get all types of feedback
    const [feedback] = await connection.execute(`
      SELECT 
        f.*,
        u.name as user_name,
        CASE 
          WHEN sf.id IS NOT NULL THEN 'student'
          WHEN af.id IS NOT NULL THEN 'alumni'
          WHEN pf.id IS NOT NULL THEN 'parent'
          WHEN tf.id IS NOT NULL THEN 'faculty'
        END as feedback_type,
        sf.*, af.*, pf.*, tf.*
      FROM feedback f
      JOIN users u ON f.stakeholder_id = u.id
      LEFT JOIN student_feedback sf ON f.id = sf.feedback_id
      LEFT JOIN alumni_feedback af ON f.id = af.feedback_id
      LEFT JOIN parent_feedback pf ON f.id = pf.feedback_id
      LEFT JOIN teacher_feedback tf ON f.id = tf.feedback_id
      WHERE f.course_id = ?
      ORDER BY f.submitted_at DESC
    `, [courseId]);

    res.json({
      course: course[0],
      feedback
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 