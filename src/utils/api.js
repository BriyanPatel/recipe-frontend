// utils/api.js
import axios from 'axios';

let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Replace with your backend URL
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optionally, handle responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors, etc.
    return Promise.reject(error);
  }
);

export default api;
