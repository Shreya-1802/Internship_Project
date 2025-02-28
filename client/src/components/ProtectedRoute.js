import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireFaculty = false }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireFaculty && user.role !== 'faculty') {
    return <Navigate to="/feedback" />;
  }

  return children;
};

export default ProtectedRoute; 