const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Database connection configuration
const getDbConfig = () => ({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // This allows self-signed certificates
  }
});

// Get overall dashboard statistics
router.get('/stats', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(getDbConfig());

    // Get course stats
    const [courseStats] = await connection.execute(`
      SELECT 
        COUNT(*) as total_courses,
        (SELECT AVG(rating) FROM feedback) as average_rating
      FROM courses
    `);

    // Get feedback distribution by stakeholder type
    const [feedbackStats] = await connection.execute(`
      SELECT 
        CASE 
          WHEN sf.id IS NOT NULL THEN 'student'
          WHEN af.id IS NOT NULL THEN 'alumni'
          WHEN pf.id IS NOT NULL THEN 'parent'
          WHEN tf.id IS NOT NULL THEN 'faculty'
        END as role,
        COUNT(*) as feedback_count,
        AVG(f.rating) as average_rating
      FROM feedback f
      LEFT JOIN student_feedback sf ON f.id = sf.feedback_id
      LEFT JOIN alumni_feedback af ON f.id = af.feedback_id
      LEFT JOIN parent_feedback pf ON f.id = pf.feedback_id
      LEFT JOIN teacher_feedback tf ON f.id = tf.feedback_id
      GROUP BY 
        CASE 
          WHEN sf.id IS NOT NULL THEN 'student'
          WHEN af.id IS NOT NULL THEN 'alumni'
          WHEN pf.id IS NOT NULL THEN 'parent'
          WHEN tf.id IS NOT NULL THEN 'faculty'
        END
    `);

    // Get top courses
    const [topCourses] = await connection.execute(`
      SELECT 
        c.id,
        c.name,
        COUNT(f.id) as feedback_count,
        AVG(f.rating) as average_rating,
        AVG(CASE WHEN sf.id IS NOT NULL THEN sf.teaching_quality END) as avg_teaching_quality,
        AVG(CASE WHEN af.id IS NOT NULL THEN af.industry_relevance END) as avg_industry_relevance,
        AVG(CASE WHEN pf.id IS NOT NULL THEN pf.overall_satisfaction END) as avg_parent_satisfaction,
        AVG(CASE WHEN tf.id IS NOT NULL THEN tf.student_progress END) as avg_student_progress
      FROM courses c
      LEFT JOIN feedback f ON c.id = f.course_id
      LEFT JOIN student_feedback sf ON f.id = sf.feedback_id
      LEFT JOIN alumni_feedback af ON f.id = af.feedback_id
      LEFT JOIN parent_feedback pf ON f.id = pf.feedback_id
      LEFT JOIN teacher_feedback tf ON f.id = tf.feedback_id
      GROUP BY c.id, c.name
      ORDER BY average_rating DESC
      LIMIT 5
    `);

    // Get recent feedback with detailed information
    const [recentFeedback] = await connection.execute(`
      SELECT 
        f.*,
        c.name as course_name,
        u.name as user_name,
        CASE 
          WHEN sf.id IS NOT NULL THEN 'student'
          WHEN af.id IS NOT NULL THEN 'alumni'
          WHEN pf.id IS NOT NULL THEN 'parent'
          WHEN tf.id IS NOT NULL THEN 'faculty'
        END as role,
        sf.teaching_quality, sf.course_difficulty,
        af.industry_relevance, af.salary_impact,
        pf.academic_improvement, pf.concerns,
        tf.student_progress, tf.syllabus_coverage
      FROM feedback f
      JOIN courses c ON f.course_id = c.id
      JOIN users u ON f.stakeholder_id = u.id
      LEFT JOIN student_feedback sf ON f.id = sf.feedback_id
      LEFT JOIN alumni_feedback af ON f.id = af.feedback_id
      LEFT JOIN parent_feedback pf ON f.id = pf.feedback_id
      LEFT JOIN teacher_feedback tf ON f.id = tf.feedback_id
      ORDER BY f.submitted_at DESC
      LIMIT 10
    `);

    res.json({
      courseStats: courseStats[0],
      feedbackByRole: feedbackStats,
      topCourses,
      recentFeedback
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// Get role-specific dashboard data
router.get('/role/:role', async (req, res) => {
  const { role } = req.params;
  let connection;

  try {
    connection = await mysql.createConnection(getDbConfig());

    let roleSpecificStats;
    let roleSpecificCourses;

    switch (role) {
      case 'student':
        [roleSpecificStats] = await connection.execute(`
          SELECT 
            COUNT(*) as total_feedback,
            AVG(f.rating) as average_rating,
            AVG(sf.teaching_quality) as avg_teaching_quality,
            AVG(sf.practical_application) as avg_practical_application,
            MODE(sf.course_difficulty) as common_difficulty,
            AVG(sf.content_depth) as avg_content_depth
          FROM feedback f
          JOIN student_feedback sf ON f.id = sf.feedback_id
        `);

        [roleSpecificCourses] = await connection.execute(`
          SELECT 
            c.id,
            c.name,
            COUNT(f.id) as feedback_count,
            AVG(f.rating) as average_rating,
            AVG(sf.teaching_quality) as avg_teaching_quality,
            MODE(sf.course_difficulty) as common_difficulty
          FROM courses c
          JOIN feedback f ON c.id = f.course_id
          JOIN student_feedback sf ON f.id = sf.feedback_id
          GROUP BY c.id, c.name
          ORDER BY average_rating DESC
          LIMIT 5
        `);
        break;

      case 'faculty':
        [roleSpecificStats] = await connection.execute(`
          SELECT 
            COUNT(*) as total_feedback,
            AVG(f.rating) as average_rating,
            AVG(tf.lab_facilities) as avg_lab_facilities,
            AVG(tf.student_progress) as avg_student_progress,
            AVG(tf.syllabus_coverage) as avg_syllabus_coverage
          FROM feedback f
          JOIN teacher_feedback tf ON f.id = tf.feedback_id
        `);

        [roleSpecificCourses] = await connection.execute(`
          SELECT 
            c.id,
            c.name,
            COUNT(f.id) as feedback_count,
            AVG(f.rating) as average_rating,
            AVG(tf.student_progress) as avg_student_progress,
            AVG(tf.syllabus_coverage) as avg_syllabus_coverage
          FROM courses c
          JOIN feedback f ON c.id = f.course_id
          JOIN teacher_feedback tf ON f.id = tf.feedback_id
          GROUP BY c.id, c.name
          ORDER BY average_rating DESC
          LIMIT 5
        `);
        break;

      case 'alumni':
        [roleSpecificStats] = await connection.execute(`
          SELECT 
            COUNT(*) as total_feedback,
            AVG(f.rating) as average_rating,
            AVG(af.industry_relevance) as avg_industry_relevance,
            AVG(af.career_growth) as avg_career_growth,
            MODE(af.salary_impact) as common_salary_impact
          FROM feedback f
          JOIN alumni_feedback af ON f.id = af.feedback_id
        `);

        [roleSpecificCourses] = await connection.execute(`
          SELECT 
            c.id,
            c.name,
            COUNT(f.id) as feedback_count,
            AVG(f.rating) as average_rating,
            AVG(af.industry_relevance) as avg_industry_relevance,
            MODE(af.salary_impact) as common_salary_impact
          FROM courses c
          JOIN feedback f ON c.id = f.course_id
          JOIN alumni_feedback af ON f.id = af.feedback_id
          GROUP BY c.id, c.name
          ORDER BY average_rating DESC
          LIMIT 5
        `);
        break;

      case 'parent':
        [roleSpecificStats] = await connection.execute(`
          SELECT 
            COUNT(*) as total_feedback,
            AVG(f.rating) as average_rating,
            AVG(pf.academic_improvement) as avg_academic_improvement,
            AVG(pf.overall_satisfaction) as avg_overall_satisfaction,
            MODE(pf.concerns) as common_concerns
          FROM feedback f
          JOIN parent_feedback pf ON f.id = pf.feedback_id
        `);

        [roleSpecificCourses] = await connection.execute(`
          SELECT 
            c.id,
            c.name,
            COUNT(f.id) as feedback_count,
            AVG(f.rating) as average_rating,
            AVG(pf.academic_improvement) as avg_academic_improvement,
            AVG(pf.overall_satisfaction) as avg_overall_satisfaction
          FROM courses c
          JOIN feedback f ON c.id = f.course_id
          JOIN parent_feedback pf ON f.id = pf.feedback_id
          GROUP BY c.id, c.name
          ORDER BY average_rating DESC
          LIMIT 5
        `);
        break;
    }

    res.json({
      roleStats: roleSpecificStats[0],
      topCoursesByRole: roleSpecificCourses
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch role-specific dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

module.exports = router; 