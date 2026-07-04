// ─────────────────────────────────────────────────────────────────────────────
// src/config/cors.config.js — CORS Whitelist
// Reads allowed origins from environment variables for Render/Vercel support.
// ─────────────────────────────────────────────────────────────────────────────

const allowedOrigins = [
  'http://localhost:5173', // Vite dev server default port
  'http://localhost:3000',
  process.env.FRONTEND_URL,         // Vercel production URL
  process.env.FRONTEND_PREVIEW_URL, // Vercel preview URL (optional)
].filter(Boolean); // remove undefined values if env vars not set

export const corsOptions = {
  origin: (origin, callback) => {
    // allow Postman/curl (no origin) in dev, or whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  credentials: true, // allow cookies / Authorization headers
};
