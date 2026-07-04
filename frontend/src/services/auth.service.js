// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/services/auth.service.js — Auth Related API Calls
// ─────────────────────────────────────────────────────────────────────────────
import api from './api';

export const registerUser = async (userData) => {
  // userData: { name, email, password, role, college, year }
  const res = await api.post('/auth/register', userData);
  return res.data; // returns { success, statusCode, data: { user, token }, message }
};

export const loginUser = async (credentials) => {
  // credentials: { email, password }
  const res = await api.post('/auth/login', credentials);
  return res.data; // returns { success, statusCode, data: { user, token }, message }
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data; // returns { success, statusCode, data: user, message }
};
