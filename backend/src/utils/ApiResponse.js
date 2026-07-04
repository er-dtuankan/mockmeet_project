// ─────────────────────────────────────────────────────────────────────────────
// src/utils/ApiResponse.js — Standard Success Response Shape
// Every success response has the same JSON structure so frontend can rely on it.
// ─────────────────────────────────────────────────────────────────────────────
class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
