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
  Stack,
  Chip,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  School as SchoolIcon,
  Star as StarIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { API_ENDPOINTS, getAuthHeader } from '../config/api';
import { courses as coursesData } from '../data/courses';

const FeedbackForm = () => {
  const [formFields, setFormFields] = useState([]);
  const [selectedTrimester, setSelectedTrimester] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    courseId: '',
    rating: 0,
    comments: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  // Get trimesters from courses data
  const trimesters = Object.keys(coursesData);

  // Get courses for selected trimester
  const coursesForTrimester = selectedTrimester ? coursesData[selectedTrimester] : {};

  // Fetch role-specific fields
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const fieldsResponse = await axios.get(
          API_ENDPOINTS.FEEDBACK.GET_FIELDS(user.role),
          { headers: getAuthHeader() }
        );

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
        setError('Failed to fetch form fields');
        console.error('Error fetching form fields:', err);
      }
    };

    fetchFields();
  }, [user.role]);

  const handleTrimesterChange = (event) => {
    const trimester = event.target.value;
    setSelectedTrimester(trimester);
    setSelectedCourse(null);
    setFormData(prev => ({
      ...prev,
      courseId: ''
    }));
  };

  const handleCourseChange = (event) => {
    const courseName = event.target.value;
    const courseInfo = coursesData[selectedTrimester][courseName];
    handleCourseSelect(selectedTrimester, courseName, courseInfo);
  };

  const handleCourseSelect = (trimester, courseName, courseInfo) => {
    setSelectedCourse({
      id: courseName,
      name: courseName,
      trimester: trimester.replace('Trimester ', ''),
      credits: courseInfo.credits,
      description: courseInfo.description
    });
    setFormData(prev => ({
      ...prev,
      courseId: courseName
    }));
  };

  const handleRatingChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
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
      setSelectedCourse(null);
      
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
              onChange={(e) => handleRatingChange(field.name, e.target.value)}
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
            onChange={(e) => handleRatingChange(field.name, e.target.value)}
            margin="normal"
          />
        );
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom color="primary">
            Course Feedback Form
          </Typography>
          <Typography variant="subtitle1" align="center" gutterBottom color="text.secondary" sx={{ mb: 4 }}>
            Select a course and provide your valuable feedback
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

          <Grid container spacing={4}>
            {/* Course Selection Section */}
            <Grid item xs={12} md={5}>
              <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Select Course
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Trimester</InputLabel>
                  <Select
                    value={selectedTrimester}
                    onChange={handleTrimesterChange}
                    label="Trimester"
                  >
                    {trimesters.map((trimester) => (
                      <MenuItem key={trimester} value={trimester}>
                        {trimester}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedTrimester}>
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={selectedCourse?.id || ''}
                    onChange={handleCourseChange}
                    label="Course"
                  >
                    {Object.entries(coursesForTrimester).map(([courseName, courseInfo]) => (
                      <MenuItem key={courseName} value={courseName}>
                        {courseName} ({courseInfo.credits} Credits)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedCourse && (
                  <Card variant="outlined" sx={{ mt: 2 }}>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Course Description
                      </Typography>
                      <Typography variant="body2">
                        {coursesData[selectedTrimester][selectedCourse.id].description}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Paper>
            </Grid>

            {/* Feedback Form Section */}
            <Grid item xs={12} md={7}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Provide Feedback
                </Typography>
                
                {selectedCourse ? (
                  <form onSubmit={handleSubmit}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Selected Course:
                      </Typography>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" color="primary">
                            {selectedCourse.name}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Chip
                              icon={<StarIcon />}
                              label={`${selectedCourse.credits} Credits`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Chip
                              icon={<AssignmentIcon />}
                              label={`${selectedCourse.trimester}`}
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Box>

                    <Box sx={{ mt: 3, mb: 2 }}>
                      <Typography component="legend">Overall Rating</Typography>
                      <Rating
                        name="rating"
                        value={formData.rating}
                        onChange={(event, newValue) => handleRatingChange('rating', newValue)}
                        size="large"
                      />
                    </Box>

                    <Divider sx={{ my: 3 }} />

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
                      onChange={(e) => handleRatingChange('comments', e.target.value)}
                      margin="normal"
                      required
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ mt: 3 }}
                      disabled={!formData.courseId || !formData.rating}
                    >
                      Submit Feedback
                    </Button>
                  </form>
                ) : (
                  <Box sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    color: 'text.secondary',
                    backgroundColor: 'grey.50',
                    borderRadius: 1
                  }}>
                    <SchoolIcon sx={{ fontSize: 40, mb: 2, color: 'primary.main' }} />
                    <Typography>
                      Please select a course from the left panel to provide feedback
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default FeedbackForm; 