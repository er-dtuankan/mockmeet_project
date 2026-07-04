// ─────────────────────────────────────────────────────────────────────────────
// src/models/Booking.model.js — Interview Booking Schema
// populate() fills student/interviewer/slot with full documents on read.
// ─────────────────────────────────────────────────────────────────────────────
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
      required: true,
    },
    domain: {
      type: String,
      required: true,
      enum: ['DSA', 'System Design', 'HR', 'Frontend', 'Backend', 'Machine Learning', 'DevOps', 'DBMS'],
    },
    meetLink: {
      type: String,
      required: true,  // generated on booking creation
    },
    scheduledAt: {
      type: Date,       // actual Date object for easy sorting
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending', // starts as pending until interviewer accepts
    },
    notes: {
      type: String,
      default: '',
      maxlength: 500,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
