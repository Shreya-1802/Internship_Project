import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
  Card,
  CardContent,
  Avatar,
  Rating,
  Fade,
  Slide,
  Grow
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import FeedbackIcon from '@mui/icons-material/Feedback';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SecurityIcon from '@mui/icons-material/Security';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: 'Course Management',
      description: 'Efficiently manage and track course feedback across different departments.'
    },
    {
      icon: <FeedbackIcon sx={{ fontSize: 40 }} />,
      title: 'Multi-stakeholder Feedback',
      description: 'Collect comprehensive feedback from students, faculty, alumni, and parents.'
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: 'Advanced Analytics',
      description: 'Get detailed insights with AI-powered analysis and visualization tools.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure & Private',
      description: 'Your feedback data is protected with industry-standard security measures.'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Dean of Engineering',
      avatar: '/images/avatar1.jpg',
      content: 'SmartEd has revolutionized how we collect and analyze student feedback. The insights we get are invaluable.',
      rating: 5
    },
    {
      name: 'Prof. Michael Chen',
      role: 'Department Head',
      avatar: '/images/avatar2.jpg',
      content: 'The multi-stakeholder approach gives us a complete picture of our course effectiveness.',
      rating: 5
    },
    {
      name: 'Emily Parker',
      role: 'Student Council President',
      avatar: '/images/avatar3.jpg',
      content: 'Finally, a platform that makes it easy to provide meaningful feedback about our courses.',
      rating: 4
    }
  ];

  const stats = [
    { value: '50+', label: 'Universities' },
    { value: '10k+', label: 'Users' },
    { value: '100k+', label: 'Feedback Collected' },
    { value: '95%', label: 'Satisfaction Rate' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
          pt: 8
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      background: `-webkit-linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Transform Education Through Feedback
                  </Typography>
                  <Typography variant="h5" color="text.secondary" paragraph>
                    Empower your institution with our comprehensive feedback management system.
                    Make data-driven decisions and enhance the learning experience.
                  </Typography>
                  <Box sx={{ mt: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{ mr: 2 }}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/login')}
                    >
                      Sign In
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Slide direction="left" in timeout={1000}>
                <Box
                  component="img"
                  src="/images/hero-image.svg"
                  alt="Course Feedback"
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    height: 'auto',
                    display: 'block',
                    margin: 'auto'
                  }}
                />
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Grow in timeout={1000 + index * 200}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: 'transparent',
                    border: `2px solid ${theme.palette.primary.main}20`
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.primary.main,
                      mb: 1
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: theme.palette.background.paper }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{ mb: 6 }}
          >
            Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Grow in timeout={1000 + index * 200}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '100%',
                      textAlign: 'center',
                      backgroundColor: 'transparent',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-8px)'
                      }
                    }}
                  >
                    <Box sx={{ 
                      color: theme.palette.primary.main,
                      mb: 2
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
        >
          What People Say
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Trusted by leading educational institutions
        </Typography>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Fade in timeout={1000 + index * 200}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.2s'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <Rating value={testimonial.rating} readOnly />
                    </Box>
                    <Typography
                      variant="body1"
                      paragraph
                      sx={{ 
                        fontStyle: 'italic',
                        minHeight: 80
                      }}
                    >
                      "{testimonial.content}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={testimonial.avatar}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          backgroundColor: theme.palette.primary.main,
          color: 'white'
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ color: 'white' }}
          >
            Ready to Get Started?
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}
          >
            Join thousands of institutions already using SmartEd
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                mr: 2,
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/contact')}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.9)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Contact Sales
            </Button>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Landing; 