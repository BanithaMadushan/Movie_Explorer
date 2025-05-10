// API configuration for connecting to backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://movieflix-server.vercel.app';

// Helper function to build API URLs
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Example usage:
// import { getApiUrl } from '../utils/api';
// fetch(getApiUrl('/movies')); 