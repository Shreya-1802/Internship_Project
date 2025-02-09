import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import axios from 'axios';
import { API_ENDPOINTS, getAuthHeader } from '../config/api';

const FeedbackForm = () => {
  const [courses, setCourses] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({
    courseId: '',
    rating: 0,
    comments: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, fieldsResponse] = await Promise.all([
          axios.get(API_ENDPOINTS.FEEDBACK.GET_COURSES, {
            headers: getAuthHeader()
          }),
          axios.get(API_ENDPOINTS.FEEDBACK.GET_FIELDS(user.role), {
            headers: getAuthHeader()
          })
        ]);

        setCourses(coursesResponse.data);
        setFormFields(fieldsResponse.data);

        // Initialize formData with role-specific fields
        const initialRoleData = {};
        fieldsResponse.data.forEach(field => {
          initialRoleData[field.name] = field.type === 'rating' ? 0 : '';
        });

        setFormData(prev => ({
          ...prev,
          ...initialRoleData
        }));
      } catch (err) {
        setError('Failed to fetch form data');
      }
    };

    fetchData();
  }, [user.role]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRatingChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        API_ENDPOINTS.FEEDBACK.SUBMIT,
        {
          ...formData,
          userId: user.id,
          role: user.role,
        },
        {
          headers: getAuthHeader()
        }
      );

      setSuccess('Feedback submitted successfully');
      
      // Reset form
      const resetData = {
        courseId: '',
        rating: 0,
        comments: '',
      };
      formFields.forEach(field => {
        resetData[field.name] = field.type === 'rating' ? 0 : '';
      });
      setFormData(resetData);
      
      // Show AI analysis
      if (response.data.analysis) {
        setSuccess(prev => `${prev}. AI Analysis: ${response.data.analysis}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'rating':
        return (
          <Box key={field.name} sx={{ mb: 2 }}>
            <Typography component="legend">{field.label}</Typography>
            <Rating
              name={field.name}
              value={formData[field.name]}
              onChange={(event, newValue) => handleRatingChange(field.name, newValue)}
              size="large"
            />
          </Box>
        );

      case 'select':
        return (
          <FormControl key={field.name} fullWidth margin="normal">
            <InputLabel>{field.label}</InputLabel>
            <Select
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              label={field.label}
            >
              {field.options.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'text':
      default:
        return (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            margin="normal"
          />
        );
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Submit Course Feedback
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Course</InputLabel>
              <Select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                label="Course"
              >
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography component="legend">Overall Rating</Typography>
              <Rating
                name="rating"
                value={formData.rating}
                onChange={(event, newValue) => handleRatingChange('rating', newValue)}
                size="large"
              />
            </Box>

            <Grid container spacing={2}>
              {formFields.map(field => (
                <Grid item xs={12} md={6} key={field.name}>
                  {renderField(field)}
                </Grid>
              ))}
            </Grid>

            <TextField
              fullWidth
              label="Additional Comments"
              name="comments"
              multiline
              rows={4}
              value={formData.comments}
              onChange={handleChange}
              margin="normal"
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              disabled={!formData.courseId || !formData.rating}
            >
              Submit Feedback
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default FeedbackForm; 