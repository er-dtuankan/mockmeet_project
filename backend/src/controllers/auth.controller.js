// ─────────────────────────────────────────────────────────────────────────────
// src/controllers/auth.controller.js — Register & Login
// Hitesh pattern: controller functions are pure logic, no try-catch needed
// because asyncHandler + errorMiddleware handle it globally.
// ─────────────────────────────────────────────────────────────────────────────
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// ── Helper: sign a JWT token with user id and role ───────────────────────────
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role }, // payload: minimal data only
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// POST /api/v1/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, college, year } = req.body;

  // basic validation — Mongoose schema also validates, but explicit is better
  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required');
  }

  // check if email is already registered (Mongoose unique would also catch this,
  // but we give a friendlier error message here)
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, 'An account with this email already exists');

  // create user — password hashing happens in the pre-save hook of User.model.js
  const user = await User.create({ name, email, password, role, college, year });

  const token = generateToken(user);

  // return user without password (select('-password') removes it from the doc)
  const safeUser = await User.findById(user._id).select('-password');

  return res.status(201).json(
    new ApiResponse(201, { user: safeUser, token }, 'Account created successfully!')
  );
});

// POST /api/v1/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  // findOne with select('+password') overrides the schema's select:false
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid email or password'); // vague for security

  // use the instance method defined in User.model.js
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');

  const token = generateToken(user);

  // send user without the password hash
  const safeUser = await User.findById(user._id).select('-password');

  return res.status(200).json(
    new ApiResponse(200, { user: safeUser, token }, 'Login successful!')
  );
});

// GET /api/v1/auth/me — get the currently authenticated user
export const getMe = asyncHandler(async (req, res) => {
  // req.user is attached by verifyJWT middleware
  return res.status(200).json(
    new ApiResponse(200, req.user, 'User profile fetched')
  );
});
