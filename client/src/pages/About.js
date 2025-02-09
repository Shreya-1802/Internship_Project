import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  useTheme,
  Paper,
  Divider,
  Fade,
} from '@mui/material';
import {
  School as SchoolIcon,
  Timeline as TimelineIcon,
  EmojiObjects as VisionIcon,
  Groups as TeamIcon,
} from '@mui/icons-material';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const About = () => {
  const theme = useTheme();

  const teamMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Founder & CEO',
      avatar: '/images/team/sarah.jpg',
      bio: 'Former Dean of Computer Science with 15+ years of experience in educational technology.'
    },
    {
      name: 'Michael Chen',
      role: 'Chief Technology Officer',
      avatar: '/images/team/michael.jpg',
      bio: 'Tech veteran with expertise in AI and machine learning applications in education.'
    },
    {
      name: 'Emily Parker',
      role: 'Head of Product',
      avatar: '/images/team/emily.jpg',
      bio: 'Educational consultant turned product leader, focused on user-centric design.'
    },
    {
      name: 'James Wilson',
      role: 'Head of Customer Success',
      avatar: '/images/team/james.jpg',
      bio: 'Dedicated to helping institutions implement effective feedback systems.'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Foundation',
      description: 'SmartEd was founded with a vision to transform educational feedback systems.'
    },
    {
      year: '2021',
      title: 'First Launch',
      description: 'Successfully launched our platform with 10 pilot institutions.'
    },
    {
      year: '2022',
      title: 'AI Integration',
      description: 'Introduced AI-powered analytics for deeper insights.'
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Expanded to serve over 50 institutions worldwide.'
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
            About Us
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 8 }}
          >
            Transforming education through innovative feedback solutions
          </Typography>
        </Container>
      </Box>

      {/* Mission & Vision Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    borderColor: theme.palette.primary.main
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                  <Typography variant="h4">Our Mission</Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  To revolutionize educational feedback by providing institutions with powerful, 
                  intuitive tools that enhance the learning experience through data-driven insights 
                  and meaningful stakeholder engagement.
                </Typography>
              </Paper>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <Fade in timeout={1200}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    borderColor: theme.palette.primary.main
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <VisionIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                  <Typography variant="h4">Our Vision</Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  To be the global leader in educational feedback management, empowering institutions 
                  to deliver exceptional learning experiences through continuous improvement and 
                  innovation.
                </Typography>
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Container>

      {/* Timeline Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Our Journey
          </Typography>
          <Grid container spacing={4}>
            {milestones.map((milestone, index) => (
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
                    <TimelineIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 2 }} />
                    <Typography variant="h3" color="primary" gutterBottom>
                      {milestone.year}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {milestone.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {milestone.description}
                    </Typography>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Our Team
        </Typography>
        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar
                      src={member.avatar}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 2,
                        border: `4px solid ${theme.palette.primary.main}`
                      }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
                      {member.role}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default About; 