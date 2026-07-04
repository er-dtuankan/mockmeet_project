// ─────────────────────────────────────────────────────────────────────────────
// src/controllers/notification.controller.js
// ─────────────────────────────────────────────────────────────────────────────
import Notification from '../models/Notification.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/v1/notifications
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(30); // cap at 30 most recent
  return res.status(200).json(new ApiResponse(200, notifications, 'Notifications'));
});

// PATCH /api/v1/notifications/read — mark all as read
export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  return res.status(200).json(new ApiResponse(200, {}, 'All notifications marked as read'));
});
