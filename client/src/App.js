import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/Layout';

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

// Theme configuration
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

// Wrapper component for authenticated pages
const AuthenticatedLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

// Wrapper component for non-authenticated pages (except Landing)
const NonAuthenticatedLayout = ({ children, showNavbar = true }) => (
  <>
    {showNavbar && <Navbar />}
    {children}
  </>
);

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
        <Layout>
          <Routes>
            {/* Landing Page - No Navbar */}
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  <Navigate to={getDefaultRoute()} />
                ) : (
                  <NonAuthenticatedLayout showNavbar={false}>
                    <Landing />
                  </NonAuthenticatedLayout>
                )
              } 
            />

            {/* Public Routes - With Navbar */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <Navigate to={getDefaultRoute()} />
                ) : (
                  <NonAuthenticatedLayout>
                    <Login />
                  </NonAuthenticatedLayout>
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? (
                  <Navigate to={getDefaultRoute()} />
                ) : (
                  <NonAuthenticatedLayout>
                    <Register />
                  </NonAuthenticatedLayout>
                )
              } 
            />
            <Route 
              path="/features" 
              element={
                <NonAuthenticatedLayout>
                  <Features />
                </NonAuthenticatedLayout>
              } 
            />
            <Route 
              path="/about" 
              element={
                <NonAuthenticatedLayout>
                  <About />
                </NonAuthenticatedLayout>
              } 
            />
            <Route 
              path="/contact" 
              element={
                <NonAuthenticatedLayout>
                  <Contact />
                </NonAuthenticatedLayout>
              } 
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireFaculty={true}>
                  <AuthenticatedLayout>
                    <Dashboard />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <Courses />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <FeedbackForm />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to={getDefaultRoute()} />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
