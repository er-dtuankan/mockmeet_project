// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/services/slot.service.js — Slot Management Services
// ─────────────────────────────────────────────────────────────────────────────
import api from './api';

export const createSlot = async (slotData) => {
  // slotData: { date, startTime, endTime }
  const res = await api.post('/slots', slotData);
  return res.data.data;
};

export const getMySlots = async () => {
  const res = await api.get('/slots/my');
  return res.data.data;
};

export const getAvailableSlots = async (interviewerId) => {
  const res = await api.get(`/slots/${interviewerId}/available`);
  return res.data.data;
};

export const deleteSlot = async (slotId) => {
  const res = await api.delete(`/slots/${slotId}`);
  return res.data.data;
};
