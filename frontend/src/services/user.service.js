// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/services/user.service.js — User Profile Services
// ─────────────────────────────────────────────────────────────────────────────
import api from './api';

export const getInterviewers = async () => {
  const res = await api.get('/users/interviewers');
  return res.data.data;
};

export const getStudents = async () => {
  const res = await api.get('/users/students');
  return res.data.data;
};

export const getPublicProfile = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data.data;
};

export const updateProfile = async (profileData) => {
  // profileData: Partial<User> e.g. { name, bio, avatar, college, year, isInterviewer, domains }
  const res = await api.patch('/users/me', profileData);
  return res.data.data;
};
