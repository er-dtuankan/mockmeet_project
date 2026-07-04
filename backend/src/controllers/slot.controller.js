// ─────────────────────────────────────────────────────────────────────────────
// src/controllers/slot.controller.js — Time Slot CRUD
// ─────────────────────────────────────────────────────────────────────────────
import Slot from '../models/Slot.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// POST /api/v1/slots — interviewer creates a slot
export const createSlot = asyncHandler(async (req, res) => {
  const { date, startTime, endTime } = req.body;
  if (!date || !startTime || !endTime) {
    throw new ApiError(400, 'date, startTime, and endTime are required');
  }
  if (startTime >= endTime) {
    throw new ApiError(400, 'startTime must be before endTime');
  }
  // prevent creating slots in the past
  const slotDateTime = new Date(`${date}T${startTime}:00`);
  if (slotDateTime < new Date()) throw new ApiError(400, 'Cannot create a slot in the past');

  const slot = await Slot.create({ interviewer: req.user._id, date, startTime, endTime });
  return res.status(201).json(new ApiResponse(201, slot, 'Slot created'));
});

// GET /api/v1/slots/my — interviewer views their own slots
export const getMySlots = asyncHandler(async (req, res) => {
  const slots = await Slot.find({ interviewer: req.user._id }).sort({ date: 1, startTime: 1 });
  return res.status(200).json(new ApiResponse(200, slots, 'Your slots'));
});

// GET /api/v1/slots/:interviewerId/available — student browses available slots
export const getAvailableSlots = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const slots = await Slot.find({
    interviewer: req.params.interviewerId,
    isBooked: false,
    date: { $gte: today }, // only future dates
  }).sort({ date: 1, startTime: 1 });
  return res.status(200).json(new ApiResponse(200, slots, 'Available slots'));
});

// DELETE /api/v1/slots/:id — interviewer deletes an unbooked slot
export const deleteSlot = asyncHandler(async (req, res) => {
  const slot = await Slot.findById(req.params.id);
  if (!slot) throw new ApiError(404, 'Slot not found');
  if (slot.interviewer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only delete your own slots');
  }
  if (slot.isBooked) throw new ApiError(400, 'Cannot delete a booked slot');
  await slot.deleteOne();
  return res.status(200).json(new ApiResponse(200, {}, 'Slot deleted'));
});
