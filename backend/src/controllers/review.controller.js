// ─────────────────────────────────────────────────────────────────────────────
// src/controllers/review.controller.js — Review Submission
// Post-interview reviews update the reviewee's average rating atomically.
// ─────────────────────────────────────────────────────────────────────────────
import Review from '../models/Review.model.js';
import Booking from '../models/Booking.model.js';
import User from '../models/User.model.js';
import Notification from '../models/Notification.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// POST /api/v1/reviews — submit a review for a completed booking
export const submitReview = asyncHandler(async (req, res) => {
  const { bookingId, revieweeId, rating, comment, role } = req.body;
  if (!bookingId || !revieweeId || !rating || !comment) {
    throw new ApiError(400, 'bookingId, revieweeId, rating, and comment are required');
  }

  // booking must exist and be completed before reviewing
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.status !== 'completed') throw new ApiError(400, 'Can only review completed interviews');

  // verify reviewer is part of this booking
  const isStudent = booking.student.toString() === req.user._id.toString();
  const isInterviewer = booking.interviewer.toString() === req.user._id.toString();
  if (!isStudent && !isInterviewer) throw new ApiError(403, 'You are not part of this booking');

  // unique index on (booking + reviewer) will throw if duplicate
  const review = await Review.create({
    booking: bookingId,
    reviewer: req.user._id,
    reviewee: revieweeId,
    rating,
    comment,
    role,
  });

  // recompute reviewee's average rating using MongoDB aggregation
  const ratingStats = await Review.aggregate([
    { $match: { reviewee: review.reviewee } },
    { $group: { _id: '$reviewee', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (ratingStats.length > 0) {
    const { avgRating, count } = ratingStats[0];
    await User.findByIdAndUpdate(revieweeId, {
      rating: Math.round(avgRating * 10) / 10, // round to 1 decimal
      reviewCount: count,
    });
  }

  // notify the reviewee
  await Notification.create({
    user: revieweeId,
    message: `⭐ ${req.user.name} left you a ${rating}-star review!`,
    type: 'review_received',
  });

  const populated = await Review.findById(review._id)
    .populate('reviewer', 'name avatar');

  return res.status(201).json(new ApiResponse(201, populated, 'Review submitted!'));
});

// GET /api/v1/reviews/user/:id — get all reviews for a user (public profile)
export const getReviewsForUser = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ reviewee: req.params.id })
    .populate('reviewer', 'name avatar')
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, reviews, 'Reviews fetched'));
});

// GET /api/v1/reviews/check/:bookingId — has current user reviewed this booking?
export const checkReviewed = asyncHandler(async (req, res) => {
  const existing = await Review.findOne({
    booking: req.params.bookingId,
    reviewer: req.user._id,
  });
  return res.status(200).json(new ApiResponse(200, { hasReviewed: !!existing }, ''));
});
