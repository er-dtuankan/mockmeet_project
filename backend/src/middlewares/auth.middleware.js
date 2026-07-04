// ─────────────────────────────────────────────────────────────────────────────
// src/middlewares/auth.middleware.js — JWT Verification
// Reads the Bearer token from Authorization header, verifies it with
// jsonwebtoken, then attaches the full User document to req.user.
// ─────────────────────────────────────────────────────────────────────────────
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// verifyJWT: protects routes — attach to any route that needs authentication
export const verifyJWT = asyncHandler(async (req, res, next) => {
  // read token from "Authorization: Bearer <token>" header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Unauthorized: No token provided');
  }

  const token = authHeader.split(' ')[1]; // extract token after "Bearer "

  // jwt.verify throws if token is expired or tampered
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // fetch the user from DB to ensure they still exist (not deleted)
  const user = await User.findById(decoded.id).select('-password'); // exclude password
  if (!user) throw new ApiError(401, 'Unauthorized: User no longer exists');

  req.user = user; // attach user to request — available in all subsequent middleware
  next();
});

// requireRole: role-based access control (RBAC) middleware factory
// Usage: router.get('/admin', verifyJWT, requireRole('teacher'), handler)
export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, `Forbidden: Only ${roles.join('/')} can access this route`);
  }
  next();
};
