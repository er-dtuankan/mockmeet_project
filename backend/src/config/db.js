// ─────────────────────────────────────────────────────────────────────────────
// src/config/db.js — MongoDB Connection via Mongoose
// Called once on server start. Mongoose maintains the connection pool.
// ─────────────────────────────────────────────────────────────────────────────
import mongoose from 'mongoose';

export const connectDB = async () => {
  // MONGO_URI from .env — Atlas (production) or local MongoDB (dev)
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    dbName: 'mockmeet', // use a dedicated database name
  });
  console.log(`🍃 MongoDB connected: ${conn.connection.host}`);
  return conn;
};
