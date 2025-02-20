const express = require('express');
const router = express.Router();
const { renderCoursePage } = require('../course');

// GET /course
router.get('/', (req, res) => {
  const selectedTrimester = req.query.trimester;
  const html = renderCoursePage(selectedTrimester);
  res.send(html);
});

module.exports = router; 