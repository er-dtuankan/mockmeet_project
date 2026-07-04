// ─────────────────────────────────────────────────────────────────────────────
// src/controllers/booking.controller.js — Booking Logic
// On creation: generate meet link + mark slot booked + send notification.
// On status change: notify the other party.
// ─────────────────────────────────────────────────────────────────────────────
import Booking from '../models/Booking.model.js';
import Slot from '../models/Slot.model.js';
import User from '../models/User.model.js';
import Notification from '../models/Notification.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateMeetLink } from '../utils/meetLink.utils.js';

// POST /api/v1/bookings — student creates a booking
export const createBooking = asyncHandler(async (req, res) => {
  const { interviewerId, slotId, domain, notes } = req.body;

  if (!interviewerId || !slotId || !domain) {
    throw new ApiError(400, 'interviewerId, slotId, and domain are required');
  }

  // verify slot exists and is not already booked
  const slot = await Slot.findById(slotId);
  if (!slot) throw new ApiError(404, 'Slot not found');
  if (slot.isBooked) throw new ApiError(409, 'This slot is already booked');
  if (slot.interviewer.toString() !== interviewerId) {
    throw new ApiError(400, 'Slot does not belong to this interviewer');
  }

  // build scheduledAt from slot date + startTime
  const scheduledAt = new Date(`${slot.date}T${slot.startTime}:00`);
  if (scheduledAt < new Date()) throw new ApiError(400, 'Cannot book a past slot');

  // create booking + mark slot as booked atomically-ish with Promise.all
  const [booking] = await Promise.all([
    Booking.create({
      student: req.user._id,
      interviewer: interviewerId,
      slot: slotId,
      domain,
      notes,
      meetLink: generateMeetLink(),
      scheduledAt,
      status: 'pending',
    }),
    Slot.findByIdAndUpdate(slotId, { isBooked: true }),
  ]);

  // send notification to the interviewer
  const studentName = req.user.name;
  await Notification.create({
    user: interviewerId,
    message: `📅 ${studentName} has requested a ${domain} mock interview with you on ${slot.date} at ${slot.startTime}.`,
    type: 'booking_request',
  });

  // populate for full response
  const populated = await Booking.findById(booking._id)
    .populate('student', 'name email avatar college year')
    .populate('interviewer', 'name email avatar')
    .populate('slot');

  return res.status(201).json(new ApiResponse(201, populated, 'Booking created! Awaiting interviewer confirmation.'));
});

// GET /api/v1/bookings/student — student's own bookings
export const getStudentBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ student: req.user._id })
    .populate('student', 'name avatar')
    .populate('interviewer', 'name avatar college')
    .populate('slot')
    .sort({ scheduledAt: -1 });
  return res.status(200).json(new ApiResponse(200, bookings, 'Your bookings'));
});

// GET /api/v1/bookings/interviewer — interviewer's assigned bookings
export const getInterviewerBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ interviewer: req.user._id })
    .populate('student', 'name avatar college year')
    .populate('interviewer', 'name avatar')
    .populate('slot')
    .sort({ scheduledAt: -1 });
  return res.status(200).json(new ApiResponse(200, bookings, 'Interview requests'));
});

// GET /api/v1/bookings/all — teacher: all platform bookings
export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('student', 'name avatar')
    .populate('interviewer', 'name avatar')
    .populate('slot')
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, bookings, 'All bookings'));
});

// PATCH /api/v1/bookings/:id/status — interviewer confirms/declines/completes
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['confirmed', 'cancelled', 'completed'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Status must be one of: ${validStatuses.join(', ')}`);
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  // only the interviewer or a teacher can change booking status
  const isInterviewer = booking.interviewer.toString() === req.user._id.toString();
  const isTeacher = req.user.role === 'teacher';
  if (!isInterviewer && !isTeacher) throw new ApiError(403, 'Not authorized to update this booking');

  booking.status = status;
  await booking.save();

  // if completed, increment totalInterviews for both parties
  if (status === 'completed') {
    await Promise.all([
      User.findByIdAndUpdate(booking.student, { $inc: { totalInterviews: 1 } }),
      User.findByIdAndUpdate(booking.interviewer, { $inc: { totalInterviews: 1 } }),
    ]);
  }

  // notify the student about status change
  const notifMessages = {
    confirmed: `✅ Your interview booking was confirmed! Join the Meet at the scheduled time.`,
    cancelled:  `❌ Your interview booking was cancelled by the interviewer.`,
    completed:  `🏁 Your interview is marked as completed. Please leave a review!`,
  };
  await Notification.create({
    user: booking.student,
    message: notifMessages[status],
    type: `booking_${status}`,
  });

  return res.status(200).json(new ApiResponse(200, booking, `Booking ${status}`));
});
