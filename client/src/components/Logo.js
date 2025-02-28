import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

const Logo = ({ sx = {}, showText = true }) => {
  const theme = useTheme();
  
  return (
    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          ...sx
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill={theme.palette.primary.main}/>
          <path d="M16 6L4 12L16 18L28 12L16 6Z" fill="white"/>
          <path d="M10 14.5V20.5C10 22.5 16 24.5 16 24.5C16 24.5 22 22.5 22 20.5V14.5" 
            stroke="white" strokeWidth="2" fill="none"/>
          <path d="M16 11L17.5 14H20.5L18 16L19 19L16 17.5L13 19L14 16L11.5 14H14.5L16 11Z" 
            fill={theme.palette.secondary.main}/>
        </svg>
        {showText && (
          <Typography
            variant="h6"
            component="span"
            sx={{
              ml: 1.5,
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px'
            }}
          >
            SmartEd
          </Typography>
        )}
      </Box>
    </Link>
  );
};

export default Logo; 