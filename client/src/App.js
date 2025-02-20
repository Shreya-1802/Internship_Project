import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FeedbackForm from './pages/FeedbackForm';
import Courses from './pages/Courses';
import Features from './pages/Features';
import About from './pages/About';
import Contact from './pages/Contact';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2'
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162'
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c'
    },
    info: {
      main: '#00bcd4',
      light: '#4dd0e1',
      dark: '#0097a7'
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
      fontSize: '2.5rem'
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem'
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem'
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem'
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem'
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    }
  }
});

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Function to determine where to redirect after login based on role
  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/';
    return user.role === 'faculty' ? '/dashboard' : '/feedback';
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to={getDefaultRoute()} /> : <Landing />} 
          />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to={getDefaultRoute()} /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to={getDefaultRoute()} /> : <Register />} 
          />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Dashboard />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Courses />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <FeedbackForm />
                </>
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to={getDefaultRoute()} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
