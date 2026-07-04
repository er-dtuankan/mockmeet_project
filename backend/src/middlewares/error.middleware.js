// ─────────────────────────────────────────────────────────────────────────────
// src/middlewares/error.middleware.js — Global Error Handler
// Must be registered LAST in app.js (after all routes).
// Catches all errors thrown by asyncHandler and sends structured JSON.
// ─────────────────────────────────────────────────────────────────────────────
import { ApiError } from '../utils/ApiError.js';

export const errorMiddleware = (err, req, res, next) => {
  // if error is already an ApiError (our custom class), use its values
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Mongoose duplicate key error (e.g. duplicate email on register)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists. Please use a different ${field}.`,
    });
  }

  // Mongoose validation error (schema-level validation failed)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token. Please login again.' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
  }

  // fallback for unknown errors
  console.error('🔥 Unhandled Error:', err);
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  });
};
