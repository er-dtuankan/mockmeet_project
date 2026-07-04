// ─────────────────────────────────────────────────────────────────────────────
// src/models/Slot.model.js — Time Slot Schema
// ─────────────────────────────────────────────────────────────────────────────
import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    // interviewer who created this slot
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',       // populate() will join with User collection
      required: true,
    },
    date: {
      type: String,      // "YYYY-MM-DD" format — easy to filter & sort
      required: true,
    },
    startTime: {
      type: String,      // "HH:MM" (24-hour)
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,    // flipped to true when a booking is confirmed
    },
  },
  { timestamps: true }
);

const Slot = mongoose.model('Slot', slotSchema);
export default Slot;
