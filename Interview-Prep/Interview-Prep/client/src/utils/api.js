import axios from 'axios';

// Set base URL for API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://interview-prep2.onrender.com';
axios.defaults.baseURL = API_BASE_URL;

// Helper function to set auth token
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Helper function to get error message
export const getErrorMessage = (error) => {
  return error.response?.data?.message || 
    error.message || 
    'Something went wrong. Please try again.';
};

// Export axios instance
export default axios; 