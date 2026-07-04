// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/services/booking.service.js — Booking Services
// ─────────────────────────────────────────────────────────────────────────────
import api from './api';

export const createBooking = async (bookingData) => {
  // bookingData: { interviewerId, slotId, domain, notes }
  const res = await api.post('/bookings', bookingData);
  return res.data.data;
};

export const getStudentBookings = async () => {
  const res = await api.get('/bookings/student');
  return res.data.data;
};

export const getInterviewerBookings = async () => {
  const res = await api.get('/bookings/interviewer');
  return res.data.data;
};

export const getAllBookings = async () => {
  const res = await api.get('/bookings/all');
  return res.data.data;
};

export const updateBookingStatus = async (bookingId, status) => {
  // status: 'confirmed' | 'cancelled' | 'completed'
  const res = await api.patch(`/bookings/${bookingId}/status`, { status });
  return res.data.data;
};
