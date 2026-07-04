// ─────────────────────────────────────────────────────────────────────────────
// server.js — Entry Point
// Dynamic PORT binding: Render injects process.env.PORT automatically.
// ─────────────────────────────────────────────────────────────────────────────
import 'dotenv/config';              // load .env before anything else
import { app } from './app.js';      // Express app instance
import { connectDB } from './src/config/db.js'; // Mongoose connection

const PORT = process.env.PORT || 5000;

// connect to MongoDB first, then start HTTP server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📦 MongoDB connected successfully`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // crash fast on DB failure — Render will restart
  });
