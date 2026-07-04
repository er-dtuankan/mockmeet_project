// ─────────────────────────────────────────────────────────────────────────────
// src/utils/asyncHandler.js — Async Error Wrapper (Hitesh Pattern)
// Wraps every async controller function. Catches any thrown error or
// rejected promise and forwards it to errorMiddleware via next(err).
// Usage: router.get('/path', asyncHandler(myController));
// ─────────────────────────────────────────────────────────────────────────────
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next); // next(err) → errorMiddleware

export { asyncHandler };
