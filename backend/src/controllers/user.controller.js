// ─────────────────────────────────────────────────────────────────────────────
// src/controllers/user.controller.js — User Profile CRUD
// ─────────────────────────────────────────────────────────────────────────────
import User from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/v1/users/interviewers — public: all students who are interviewers
export const getInterviewers = asyncHandler(async (req, res) => {
  const interviewers = await User.find({
    isInterviewer: true,
    role: 'student',   // teachers don't interview
  }).select('-password').sort({ rating: -1 }); // sort by rating descending

  return res.status(200).json(new ApiResponse(200, interviewers, 'Interviewers fetched'));
});

// GET /api/v1/users/students — teacher-only: all students
export const getStudents = asyncHandler(async (req, res) => {
  const students = await User.find({ role: 'student' }).select('-password');
  return res.status(200).json(new ApiResponse(200, students, 'Students fetched'));
});

// GET /api/v1/users/:id — public: any user's profile
export const getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  return res.status(200).json(new ApiResponse(200, user, 'Profile fetched'));
});

// PATCH /api/v1/users/me — update current user's profile
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedUpdates = ['name', 'bio', 'avatar', 'college', 'year', 'isInterviewer', 'domains'];
  const updates = {};

  // only allow specified fields — never allow role/password change here
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true } // new:true returns the updated document
  ).select('-password');

  return res.status(200).json(new ApiResponse(200, user, 'Profile updated'));
});
