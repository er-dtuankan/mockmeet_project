// ─────────────────────────────────────────────────────────────────────────────
// src/models/Notification.model.js — Notification Schema
// ─────────────────────────────────────────────────────────────────────────────
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['booking_request', 'booking_confirmed', 'booking_cancelled', 'booking_completed', 'review_received'],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
