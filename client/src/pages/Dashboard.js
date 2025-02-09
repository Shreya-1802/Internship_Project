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
  useTheme
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
import { Bar, Pie, Line, Radar } from 'react-chartjs-2';
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
    // Convert stats to CSV
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const StatCard = ({ icon, title, value, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" color="textSecondary" ml={1}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" color={color}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Box>
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export data">
            <IconButton onClick={handleExport}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<SchoolIcon sx={{ color: theme.palette.primary.main }} />}
            title="Total Courses"
            value={stats.courseStats.total_courses}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<StarIcon sx={{ color: theme.palette.secondary.main }} />}
            title="Average Rating"
            value={stats.courseStats.average_rating?.toFixed(1) || 'N/A'}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<GroupIcon sx={{ color: theme.palette.success.main }} />}
            title="Total Feedback"
            value={stats.roleSpecific.roleStats.total_feedback}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TrendingUpIcon sx={{ color: theme.palette.info.main }} />}
            title="Active Users"
            value={stats.feedbackByRole.reduce((acc, curr) => acc + curr.feedback_count, 0)}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Tabs for different views */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Overview" />
          <Tab label="Course Analysis" />
          <Tab label="Feedback Details" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <Box hidden={activeTab !== 0}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Feedback Distribution by Role
              </Typography>
              <Box sx={{ height: 300 }}>
                <Pie
                  data={{
                    labels: stats.feedbackByRole.map(item => item.role),
                    datasets: [{
                      data: stats.feedbackByRole.map(item => item.feedback_count),
                      backgroundColor: [
                        theme.palette.primary.light,
                        theme.palette.secondary.light,
                        theme.palette.success.light,
                        theme.palette.info.light
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
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Average Ratings by Role
              </Typography>
              <Box sx={{ height: 300 }}>
                <Radar
                  data={{
                    labels: stats.feedbackByRole.map(item => item.role),
                    datasets: [{
                      label: 'Average Rating',
                      data: stats.feedbackByRole.map(item => item.average_rating),
                      backgroundColor: theme.palette.primary.main + '40',
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 5
                      }
                    }
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box hidden={activeTab !== 1}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
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

      <Box hidden={activeTab !== 2}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Feedback
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Comments</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.recentFeedback.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell>{feedback.course_name}</TableCell>
                    <TableCell>{feedback.user_name}</TableCell>
                    <TableCell>{feedback.role}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Typography>{feedback.rating}</Typography>
                        <StarIcon sx={{ ml: 0.5, color: theme.palette.warning.main }} />
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
    </Container>
  );
};

export default Dashboard; 