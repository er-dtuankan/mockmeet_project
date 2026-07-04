// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/services/review.service.js — Review Submission and Retrieval
// ─────────────────────────────────────────────────────────────────────────────
import api from './api';

export const submitReview = async (reviewData) => {
  // reviewData: { bookingId, revieweeId, rating, comment, role }
  const res = await api.post('/reviews', reviewData);
  return res.data.data;
};

export const getReviewsForUser = async (userId) => {
  const res = await api.get(`/reviews/user/${userId}`);
  return res.data.data;
};

export const checkReviewed = async (bookingId) => {
  const res = await api.get(`/reviews/check/${bookingId}`);
  return res.data.data; // returns { hasReviewed: boolean }
};
