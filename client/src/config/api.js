const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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