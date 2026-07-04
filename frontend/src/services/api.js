// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/services/api.js — Axios Instance for Frontend API Client
// All API requests are processed through this instance. It dynamically attaches
// the JWT token from localStorage to the request headers.
// ─────────────────────────────────────────────────────────────────────────────
import axios from 'axios';

// create axios instance with backend base URL
const api = axios.create({
  baseURL: 'https://mockmeet-backend.onrender.com/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token from localStorage to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('🔑 Token expired or unauthorized. Logging out.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // If we are not on login/register/landing, redirect to login
      if (
        window.location.pathname !== '/' &&
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register'
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
