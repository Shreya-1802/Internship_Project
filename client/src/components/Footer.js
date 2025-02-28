import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  useTheme,
  alpha,
  Divider
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: alpha(theme.palette.primary.main, 0.03),
        py: 6,
        position: 'relative',
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" mb={2}>
              <SchoolIcon sx={{ fontSize: 32, color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="h6" color="primary" fontWeight="bold">
                SmartEd Feedback
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Empowering education through comprehensive feedback analysis and insights.
              Making learning better, one feedback at a time.
            </Typography>
            <Box>
              <IconButton
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  mr: 1,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-3px)' }
                }}
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  mr: 1,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-3px)' }
                }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                href="mailto:contact@smarted.com"
                sx={{ 
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-3px)' }
                }}
              >
                <EmailIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
              Quick Links 
            </Typography>
            <Link href="/" color="inherit" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}>
              Home
            </Link>
            <Link href="/dashboard" color="inherit" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}>
              Dashboard
            </Link>
            <Link href="/courses" color="inherit" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}>
              Courses
            </Link>
            <Link href="/about" color="inherit" display="block" sx={{ textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}>
              About
            </Link>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
              Resources
            </Typography>
            <Link href="/faq" color="inherit" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}>
              FAQ
            </Link>
            <Link href="/privacy" color="inherit" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}>
              Privacy Policy
            </Link>
            <Link href="/terms" color="inherit" display="block" sx={{ textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}>
              Terms of Service
            </Link>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Email: contact@smarted.com
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Phone: +91 9876543210
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Address: CHRIST University, Bangalore
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4 }} />
        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            © {currentYear} SmartEd Feedback Analyzer. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 