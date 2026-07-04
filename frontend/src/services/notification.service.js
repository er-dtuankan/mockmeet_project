// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/services/notification.service.js — Notifications API Calls
// ─────────────────────────────────────────────────────────────────────────────
import api from './api';

export const getNotifications = async () => {
  const res = await api.get('/notifications');
  return res.data.data;
};

export const markAllNotificationsRead = async () => {
  const res = await api.patch('/notifications/read');
  return res.data.data;
};
