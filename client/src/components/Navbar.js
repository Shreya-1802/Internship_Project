import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Course Feedback System
          </Typography>
          <Button color="inherit" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button color="inherit" onClick={() => navigate('/register')}>
            Register
          </Button>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Course Feedback System
        </Typography>
        
        {/* Show Dashboard button only for faculty */}
        {user.role === 'faculty' && (
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        )}
        
        {/* Show Feedback button for all users */}
        <Button color="inherit" onClick={() => navigate('/feedback')}>
          {user.role === 'faculty' ? 'Give Feedback' : 'Feedback Form'}
        </Button>

        <Box sx={{ ml: 2 }}>
          <Avatar
            onClick={handleMenu}
            sx={{ cursor: 'pointer' }}
          >
            <AccountCircle />
          </Avatar>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem>
              <Typography variant="body2" color="textSecondary">
                Logged in as {user.role}
              </Typography>
            </MenuItem>
            {user.role === 'faculty' && (
              <MenuItem onClick={() => { handleClose(); navigate('/dashboard'); }}>
                Dashboard
              </MenuItem>
            )}
            <MenuItem onClick={() => { handleClose(); navigate('/feedback'); }}>
              Feedback Form
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 