const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

// Get all courses
router.get('/courses', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [courses] = await connection.execute('SELECT * FROM courses ORDER BY trimester, name');
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ 
      message: 'Error fetching courses',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    if (connection) connection.release();
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
      { name: 'teachingQuality', label: 'Teaching Quality', type: 'rating' },
      { name: 'practicalApplication', label: 'Practical Application', type: 'rating' },
      { name: 'courseDifficulty', label: 'Course Difficulty', type: 'select', 
        options: ['Too Easy', 'Easy', 'Moderate', 'Challenging', 'Very Challenging'] },
      { name: 'contentDepth', label: 'Content Depth', type: 'rating' },
      { name: 'assignmentQuality', label: 'Assignment Quality', type: 'rating' },
      { name: 'peerLearning', label: 'Peer Learning', type: 'rating' },
      { name: 'resourcesQuality', label: 'Resources Quality', type: 'rating' },
      { name: 'doubtResolution', label: 'Doubt Resolution', type: 'select',
        options: ['Very Slow', 'Slow', 'Average', 'Quick', 'Very Quick'] },
      { name: 'instructorExpertise', label: 'Instructor Expertise', type: 'rating' },
      { name: 'labEquipment', label: 'Lab Equipment', type: 'rating' },
      { name: 'coursePace', label: 'Course Pace', type: 'select',
        options: ['Too Slow', 'Slightly Slow', 'Perfect', 'Slightly Fast', 'Too Fast'] },
      { name: 'understandingLevel', label: 'Understanding Level', type: 'rating' },
      { name: 'careerAlignment', label: 'Career Alignment', type: 'rating' }
    ],
    faculty: [
      { name: 'labFacilities', label: 'Lab Facilities', type: 'rating' },
      { name: 'curriculumFlexibility', label: 'Curriculum Flexibility', type: 'rating' },
      { name: 'classStrength', label: 'Class Strength', type: 'rating' },
      { name: 'teachingAids', label: 'Teaching Aids', type: 'rating' },
      { name: 'attendanceRate', label: 'Attendance Rate', type: 'rating' },
      { name: 'studentProgress', label: 'Student Progress', type: 'rating' },
      { name: 'studentInteraction', label: 'Student Interaction', type: 'rating' },
      { name: 'syllabusCoverage', label: 'Syllabus Coverage', type: 'rating' }
    ],
    alumni: [
      { name: 'industryRelevance', label: 'Industry Relevance', type: 'rating' },
      { name: 'careerGrowth', label: 'Career Growth', type: 'rating' },
      { name: 'salaryImpact', label: 'Salary Impact', type: 'select',
        options: ['No Impact', 'Low', 'Moderate', 'High', 'Very High'] },
      { name: 'knowledgeRetention', label: 'Knowledge Retention', type: 'rating' },
      { name: 'networkingValue', label: 'Networking Value', type: 'rating' },
      { name: 'currentRole', label: 'Current Role', type: 'text' },
      { name: 'courseApplication', label: 'Course Application', type: 'select',
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'] }
    ],
    parent: [
      { name: 'academicImprovement', label: 'Academic Improvement', type: 'rating' },
      { name: 'overallSatisfaction', label: 'Overall Satisfaction', type: 'rating' },
      { name: 'facultyCommunication', label: 'Faculty Communication', type: 'rating' },
      { name: 'feeStructure', label: 'Fee Structure', type: 'rating' },
      { name: 'concerns', label: 'Concerns', type: 'select',
        options: ['No Concerns', 'Minor Concerns', 'Moderate Concerns', 'Major Concerns'] }
    ]
  };

  res.json(fields[role] || []);
});

// Submit feedback
router.post('/submit', async (req, res) => {
  const { userId, courseId, rating, comments, role, ...roleSpecificData } = req.body;
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Start transaction
    await connection.beginTransaction();
    
    // Insert feedback
    const [result] = await connection.execute(
      'INSERT INTO feedback (user_id, course_id, rating, comments, role) VALUES (?, ?, ?, ?, ?)',
      [userId, courseId, rating, comments, role]
    );
    
    const feedbackId = result.insertId;

    // Insert role-specific feedback based on role
    switch (role) {
      case 'student':
        await connection.execute(
          `INSERT INTO student_feedback (
            feedback_id, teaching_quality, practical_application, course_difficulty,
            content_depth, assignment_quality, peer_learning, resources_quality,
            doubt_resolution, instructor_expertise, lab_equipment, course_pace,
            understanding_level, career_alignment
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            feedbackId,
            roleSpecificData.teachingQuality,
            roleSpecificData.practicalApplication,
            roleSpecificData.courseDifficulty,
            roleSpecificData.contentDepth,
            roleSpecificData.assignmentQuality,
            roleSpecificData.peerLearning,
            roleSpecificData.resourcesQuality,
            roleSpecificData.doubtResolution,
            roleSpecificData.instructorExpertise,
            roleSpecificData.labEquipment,
            roleSpecificData.coursePace,
            roleSpecificData.understandingLevel,
            roleSpecificData.careerAlignment
          ]
        );
        break;

      case 'faculty':
        await connection.execute(
          `INSERT INTO teacher_feedback (
            feedback_id, lab_facilities, curriculum_flexibility, class_strength,
            teaching_aids, attendance_rate, student_progress, student_interaction,
            syllabus_coverage
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            feedbackId,
            roleSpecificData.labFacilities,
            roleSpecificData.curriculumFlexibility,
            roleSpecificData.classStrength,
            roleSpecificData.teachingAids,
            roleSpecificData.attendanceRate,
            roleSpecificData.studentProgress,
            roleSpecificData.studentInteraction,
            roleSpecificData.syllabusCoverage
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
            roleSpecificData.industryRelevance,
            roleSpecificData.careerGrowth,
            roleSpecificData.salaryImpact,
            roleSpecificData.knowledgeRetention,
            roleSpecificData.networkingValue,
            roleSpecificData.currentRole,
            roleSpecificData.courseApplication
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
            roleSpecificData.academicImprovement,
            roleSpecificData.overallSatisfaction,
            roleSpecificData.facultyCommunication,
            roleSpecificData.feeStructure,
            roleSpecificData.concerns
          ]
        );
        break;
    }

    // Commit transaction
    await connection.commit();

    res.status(201).json({ 
      message: 'Feedback submitted successfully'
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