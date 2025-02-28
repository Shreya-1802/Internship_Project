// Function to get the API base URL with port fallback
const getApiBaseUrl = () => {
  const defaultPort = 5000; // Backend API port
  
  // If REACT_APP_API_URL is set, use that
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // In development, try to find an available port
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:${defaultPort}`;
  }

  // Default fallback
  return `http://localhost:${defaultPort}`;
};

const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  FEEDBACK: {
    SUBMIT: `${API_BASE_URL}/api/feedback/submit`,
    GET_COURSES: `${API_BASE_URL}/api/feedback/courses`,
    GET_TRIMESTER_COURSES: (trimester) => `${API_BASE_URL}/api/feedback/courses/${trimester}`,
    GET_COURSE: (id) => `${API_BASE_URL}/api/feedback/course/${id}`,
    GET_FIELDS: (role) => `${API_BASE_URL}/api/feedback/fields/${role}`,
  },
  DASHBOARD: {
    STATS: `${API_BASE_URL}/api/dashboard/stats`,
    ROLE_STATS: (role) => `${API_BASE_URL}/api/dashboard/role/${role}`,
  },
};

export const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
}); 