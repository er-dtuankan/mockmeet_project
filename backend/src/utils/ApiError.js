// ─────────────────────────────────────────────────────────────────────────────
// src/utils/ApiError.js — Custom Error Class (Hitesh Pattern)
// Extend the native Error to include statusCode + structured message.
// asyncHandler catches these and passes them to errorMiddleware.
// ─────────────────────────────────────────────────────────────────────────────
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;          // validation errors array
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiError };
