-- Drop database if it exists and create new one
DROP DATABASE IF EXISTS smarted_feedback_analyzer;
CREATE DATABASE smarted_feedback_analyzer;
USE smarted_feedback_analyzer;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'faculty', 'alumni', 'parent') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  code VARCHAR(50) NOT NULL UNIQUE,
  ai_analysis TEXT,
  last_analyzed TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  role ENUM('student', 'faculty', 'alumni', 'parent') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Student-specific feedback
CREATE TABLE IF NOT EXISTS student_feedback (
  id INT PRIMARY KEY AUTO_INCREMENT,
  feedback_id INT NOT NULL,
  teaching_quality INT CHECK (teaching_quality >= 1 AND teaching_quality <= 5),
  practical_application INT CHECK (practical_application >= 1 AND practical_application <= 5),
  course_difficulty ENUM('Too Easy', 'Easy', 'Moderate', 'Challenging', 'Very Challenging'),
  content_depth INT CHECK (content_depth >= 1 AND content_depth <= 5),
  resources_quality INT CHECK (resources_quality >= 1 AND resources_quality <= 5),
  doubt_resolution ENUM('Very Slow', 'Slow', 'Average', 'Quick', 'Very Quick'),
  instructor_expertise INT CHECK (instructor_expertise >= 1 AND instructor_expertise <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE
);

-- Faculty-specific feedback
CREATE TABLE IF NOT EXISTS teacher_feedback (
  id INT PRIMARY KEY AUTO_INCREMENT,
  feedback_id INT NOT NULL,
  lab_facilities INT CHECK (lab_facilities >= 1 AND lab_facilities <= 5),
  curriculum_flexibility INT CHECK (curriculum_flexibility >= 1 AND curriculum_flexibility <= 5),
  teaching_aids INT CHECK (teaching_aids >= 1 AND teaching_aids <= 5),
  attendance_rate INT CHECK (attendance_rate >= 1 AND attendance_rate <= 5),
  student_progress INT CHECK (student_progress >= 1 AND student_progress <= 5),
  student_interaction INT CHECK (student_interaction >= 1 AND student_interaction <= 5),
  syllabus_coverage INT CHECK (syllabus_coverage >= 1 AND syllabus_coverage <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE
);

-- Alumni-specific feedback
CREATE TABLE IF NOT EXISTS alumni_feedback (
  id INT PRIMARY KEY AUTO_INCREMENT,
  feedback_id INT NOT NULL,
  industry_relevance INT CHECK (industry_relevance >= 1 AND industry_relevance <= 5),
  career_growth INT CHECK (career_growth >= 1 AND career_growth <= 5),
  salary_impact ENUM('No Impact', 'Low', 'Moderate', 'High', 'Very High'),
  knowledge_retention INT CHECK (knowledge_retention >= 1 AND knowledge_retention <= 5),
  networking_value INT CHECK (networking_value >= 1 AND networking_value <= 5),
  current_role VARCHAR(255),
  course_application ENUM('Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE
);

-- Parent-specific feedback
CREATE TABLE IF NOT EXISTS parent_feedback (
  id INT PRIMARY KEY AUTO_INCREMENT,
  feedback_id INT NOT NULL,
  academic_improvement INT CHECK (academic_improvement >= 1 AND academic_improvement <= 5),
  overall_satisfaction INT CHECK (overall_satisfaction >= 1 AND overall_satisfaction <= 5),
  faculty_communication INT CHECK (faculty_communication >= 1 AND faculty_communication <= 5),
  fee_structure INT CHECK (fee_structure >= 1 AND fee_structure <= 5),
  concerns ENUM('No Concerns', 'Minor Concerns', 'Moderate Concerns', 'Major Concerns'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE
); 