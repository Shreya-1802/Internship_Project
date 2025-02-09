import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  useTheme,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Insights as InsightsIcon,
  Assessment as AssessmentIcon,
  AutoGraph as AutoGraphIcon,
} from '@mui/icons-material';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const Features = () => {
  const theme = useTheme();

  const mainFeatures = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: 'Course Management',
      description: 'Efficiently manage and track course feedback across different departments.',
      details: [
        'Organize courses by trimester and department',
        'Track course performance metrics',
        'Monitor student engagement and satisfaction',
        'Generate course-specific reports'
      ]
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      title: 'Multi-stakeholder Feedback',
      description: 'Collect comprehensive feedback from students, faculty, alumni, and parents.',
      details: [
        'Role-specific feedback forms',
        'Customizable evaluation criteria',
        'Anonymous feedback options',
        'Stakeholder engagement analytics'
      ]
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: 'Advanced Analytics',
      description: 'Get detailed insights with AI-powered analysis and visualization tools.',
      details: [
        'Real-time data visualization',
        'Trend analysis and predictions',
        'AI-powered feedback analysis',
        'Custom report generation'
      ]
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Security & Privacy',
      description: 'Your feedback data is protected with industry-standard security measures.',
      details: [
        'End-to-end encryption',
        'Role-based access control',
        'Data backup and recovery',
        'Compliance with privacy regulations'
      ]
    }
  ];

  const additionalFeatures = [
    {
      icon: <SpeedIcon />,
      title: 'Real-time Monitoring',
      description: 'Monitor feedback and responses in real-time with instant notifications and alerts.'
    },
    {
      icon: <InsightsIcon />,
      title: 'Predictive Analytics',
      description: 'Use AI to predict trends and potential areas of improvement in course delivery.'
    },
    {
      icon: <AssessmentIcon />,
      title: 'Custom Reports',
      description: 'Generate detailed reports with customizable parameters and visualization options.'
    },
    {
      icon: <AutoGraphIcon />,
      title: 'Performance Tracking',
      description: 'Track course and faculty performance over time with comprehensive metrics.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />

      {/* Hero Section */}
      <Box
        sx={{
          pt: 15,
          pb: 8,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `-webkit-linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Features
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 8 }}
          >
            Discover how our comprehensive feedback management system can transform your educational institution
          </Typography>
        </Container>
      </Box>

      {/* Main Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {mainFeatures.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ color: theme.palette.primary.main, mr: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" component="h2">
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      {feature.description}
                    </Typography>
                    <List>
                      {feature.details.map((detail, idx) => (
                        <ListItem key={idx} sx={{ py: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: theme.palette.primary.main
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText primary={detail} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Additional Features Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Additional Features
          </Typography>
          <Grid container spacing={4}>
            {additionalFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '100%',
                      textAlign: 'center',
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        transform: 'translateY(-4px)',
                        transition: 'all 0.2s'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        color: theme.palette.primary.main,
                        mb: 2
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {feature.description}
                    </Typography>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Features; 