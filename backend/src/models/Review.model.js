// ─────────────────────────────────────────────────────────────────────────────
// src/models/Review.model.js — Review Schema
// After a completed interview, both parties can write a review.
// ─────────────────────────────────────────────────────────────────────────────
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1, max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500,
    },
    role: {
      type: String,
      enum: ['student', 'interviewer'], // who is submitting the review
      required: true,
    },
  },
  { timestamps: true }
);

// compound index: one review per (booking + reviewer) combination
// prevents duplicate reviews for the same session
reviewSchema.index({ booking: 1, reviewer: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
