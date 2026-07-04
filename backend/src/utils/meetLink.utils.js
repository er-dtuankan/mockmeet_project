// ─────────────────────────────────────────────────────────────────────────────
// src/utils/meetLink.utils.js — Simulated Google Meet Link Generator
// Generates a realistic-looking Google Meet URL using a random code.
// Real Google Meet integration would require Google Calendar API OAuth.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a simulated Google Meet link.
 * Format: https://meet.google.com/xxx-xxxx-xxx (real Google Meet format)
 * @returns {string} meet link URL
 */
export const generateMeetLink = () => {
  // Google Meet uses 3-4-3 character format (e.g., abc-defg-hij)
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const seg = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `https://meet.google.com/${seg(3)}-${seg(4)}-${seg(3)}`;
};
