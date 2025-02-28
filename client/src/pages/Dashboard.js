import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Fade,
  Grow
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
} from 'chart.js';
import { Bar, Pie, Radar } from 'react-chartjs-2';
import axios from 'axios';
import { API_ENDPOINTS, getAuthHeader } from '../config/api';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
import { convertToCSV } from '../utils/csvExport';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const user = JSON.parse(localStorage.getItem('user'));
  const theme = useTheme();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsResponse, roleResponse] = await Promise.all([
        axios.get(API_ENDPOINTS.DASHBOARD.STATS, {
          headers: getAuthHeader()
        }),
        axios.get(API_ENDPOINTS.DASHBOARD.ROLE_STATS(user.role), {
          headers: getAuthHeader()
        })
      ]);

      setStats({
        ...statsResponse.data,
        roleSpecific: roleResponse.data
      });
    } catch (error) {
      setError('Failed to fetch dashboard data. Please try again later.');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.role]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleExport = () => {
    const csvData = convertToCSV(stats);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feedback_stats.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        sx={{
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert 
          severity="error"
          sx={{
            boxShadow: theme.shadows[3],
            borderRadius: 2
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  const StatCard = ({ icon, title, value, color }) => (
    <Grow in timeout={800}>
      <Card 
        sx={{ 
          height: '100%',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          },
          background: `linear-gradient(135deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`,
          color: 'white'
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            {React.cloneElement(icon, { sx: { color: 'white', fontSize: 32 } })}
            <Typography variant="h6" ml={1} sx={{ color: 'white' }}>
              {title}
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Grow>
  );

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`
      }}
    >
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        <Fade in timeout={600}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Dashboard
            </Typography>
            <Box>
              <Tooltip title="Refresh data">
                <IconButton 
                  onClick={handleRefresh}
                  sx={{ 
                    mr: 1,
                    '&:hover': { transform: 'rotate(180deg)', transition: 'transform 0.5s' }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export data">
                <IconButton 
                  onClick={handleExport}
                  sx={{ 
                    '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.3s' }
                  }}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Fade>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<SchoolIcon />}
              title="Total Courses"
              value={stats.courseStats.total_courses}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<StarIcon />}
              title="Average Rating"
              value={Number(stats.courseStats.average_rating || 0).toFixed(1)}
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<GroupIcon />}
              title="Total Feedback"
              value={stats.roleSpecific.roleStats.total_feedback}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<TrendingUpIcon />}
              title="Active Users"
              value={stats.feedbackByRole.reduce((acc, curr) => acc + curr.feedback_count, 0)}
              color="info"
            />
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper 
          sx={{ 
            mb: 4,
            borderRadius: 2,
            boxShadow: theme.shadows[3],
            background: alpha(theme.palette.background.paper, 0.9)
          }}
        >
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            centered
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: 1.5
              }
            }}
          >
            <Tab label="Overview" sx={{ textTransform: 'none', fontSize: '1rem' }} />
            <Tab label="Course Analysis" sx={{ textTransform: 'none', fontSize: '1rem' }} />
            <Tab label="Feedback Details" sx={{ textTransform: 'none', fontSize: '1rem' }} />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <Fade in={activeTab === 0} timeout={500}>
          <Box hidden={activeTab !== 0}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper 
                  sx={{ 
                    p: 3,
                    borderRadius: 2,
                    boxShadow: theme.shadows[3],
                    background: alpha(theme.palette.background.paper, 0.9),
                    height: '100%'
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Feedback Distribution by Role
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Pie
                      data={{
                        labels: stats.feedbackByRole.map(item => item.role),
                        datasets: [{
                          data: stats.feedbackByRole.map(item => item.feedback_count),
                          backgroundColor: [
                            theme.palette.primary.main,
                            theme.palette.secondary.main,
                            theme.palette.success.main,
                            theme.palette.info.main
                          ]
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper 
                  sx={{ 
                    p: 3,
                    borderRadius: 2,
                    boxShadow: theme.shadows[3],
                    background: alpha(theme.palette.background.paper, 0.9),
                    height: '100%'
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Average Ratings by Role
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Radar
                      data={{
                        labels: stats.feedbackByRole.map(item => item.role),
                        datasets: [{
                          label: 'Average Rating',
                          data: stats.feedbackByRole.map(item => item.average_rating),
                          backgroundColor: alpha(theme.palette.primary.main, 0.2),
                          borderColor: theme.palette.primary.main,
                          borderWidth: 2,
                          pointBackgroundColor: theme.palette.primary.main
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          r: {
                            beginAtZero: true,
                            max: 5,
                            ticks: {
                              stepSize: 1
                            }
                          }
                        }
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Fade>

        <Fade in={activeTab === 1} timeout={500}>
          <Box hidden={activeTab !== 1}>
            <Paper 
              sx={{ 
                p: 3,
                borderRadius: 2,
                boxShadow: theme.shadows[3],
                background: alpha(theme.palette.background.paper, 0.9)
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Course Performance
              </Typography>
              <Box sx={{ height: 400 }}>
                <Bar
                  data={{
                    labels: stats.topCourses.map(course => course.name),
                    datasets: [
                      {
                        label: 'Average Rating',
                        data: stats.topCourses.map(course => course.average_rating),
                        backgroundColor: theme.palette.primary.main
                      },
                      {
                        label: 'Teaching Quality',
                        data: stats.topCourses.map(course => course.avg_teaching_quality),
                        backgroundColor: theme.palette.secondary.main
                      },
                      {
                        label: 'Industry Relevance',
                        data: stats.topCourses.map(course => course.avg_industry_relevance),
                        backgroundColor: theme.palette.success.main
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 5
                      }
                    },
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </Box>
            </Paper>
          </Box>
        </Fade>

        <Fade in={activeTab === 2} timeout={500}>
          <Box hidden={activeTab !== 2}>
            <Paper 
              sx={{ 
                p: 3,
                borderRadius: 2,
                boxShadow: theme.shadows[3],
                background: alpha(theme.palette.background.paper, 0.9)
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Recent Feedback
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Rating</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Comments</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentFeedback.map((feedback) => (
                      <TableRow 
                        key={feedback.id}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            transition: 'background-color 0.3s'
                          }
                        }}
                      >
                        <TableCell>{feedback.course_name}</TableCell>
                        <TableCell>{feedback.user_name}</TableCell>
                        <TableCell>
                          <Typography 
                            component="span" 
                            sx={{ 
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '0.875rem',
                              backgroundColor: (() => {
                                switch (feedback.role) {
                                  case 'student': return alpha(theme.palette.primary.main, 0.1);
                                  case 'alumni': return alpha(theme.palette.secondary.main, 0.1);
                                  case 'parent': return alpha(theme.palette.success.main, 0.1);
                                  case 'faculty': return alpha(theme.palette.info.main, 0.1);
                                  default: return alpha(theme.palette.grey[500], 0.1);
                                }
                              })(),
                              color: (() => {
                                switch (feedback.role) {
                                  case 'student': return theme.palette.primary.main;
                                  case 'alumni': return theme.palette.secondary.main;
                                  case 'parent': return theme.palette.success.main;
                                  case 'faculty': return theme.palette.info.main;
                                  default: return theme.palette.grey[500];
                                }
                              })()
                            }}
                          >
                            {feedback.role}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography>{feedback.rating}</Typography>
                            <StarIcon 
                              sx={{ 
                                ml: 0.5, 
                                color: theme.palette.warning.main,
                                fontSize: '1.2rem'
                              }} 
                            />
                          </Box>
                        </TableCell>
                        <TableCell>{feedback.comments}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Dashboard; 