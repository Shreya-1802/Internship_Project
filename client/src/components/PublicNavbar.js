import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Slide
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';

const PublicNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/#features' },
    { label: 'About', path: '/#about' },
    { label: 'Contact', path: '/#contact' }
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ my: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SchoolIcon sx={{ mr: 1 }} />
        <Typography variant="h6">
          SmartEd
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemText 
              primary={item.label}
              onClick={() => navigate(item.path)}
              sx={{ 
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { color: theme.palette.primary.main }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Slide appear={false} direction="down" in={!isScrolled}>
      <AppBar 
        position="fixed" 
        color="inherit"
        elevation={isScrolled ? 4 : 0}
        sx={{
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          transition: 'all 0.3s'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            >
              <SchoolIcon 
                sx={{ 
                  mr: 1,
                  color: theme.palette.primary.main
                }} 
              />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 700,
                  background: `-webkit-linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                SmartEd
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
                <Drawer
                  anchor="right"
                  open={mobileOpen}
                  onClose={handleDrawerToggle}
                  ModalProps={{
                    keepMounted: true
                  }}
                >
                  {drawer}
                </Drawer>
              </>
            ) : (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {navItems.map((item) => (
                    <Button
                      key={item.label}
                      onClick={() => navigate(item.path)}
                      sx={{ 
                        mx: 1,
                        color: 'inherit',
                        '&:hover': {
                          color: theme.palette.primary.main
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/login')}
                    sx={{ ml: 2 }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/register')}
                    sx={{ ml: 2 }}
                  >
                    Get Started
                  </Button>
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </Slide>
  );
};

export default PublicNavbar; 