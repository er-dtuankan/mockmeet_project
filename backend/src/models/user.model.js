// ─────────────────────────────────────────────────────────────────────────────
// src/models/User.model.js — Mongoose User Schema
// Hitesh style: schema → model → export. Password hashed in pre-save hook.
// ─────────────────────────────────────────────────────────────────────────────
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // NEVER return password in queries by default
    },
    role: {
      type: String,
      enum: ['student', 'teacher'],
      default: 'student',
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: 500,
    },
    college: {
      type: String,
      default: '',
    },
    year: {
      type: String,
      default: '',
    },
    // students can opt-in to become interviewers
    isInterviewer: {
      type: Boolean,
      default: false,
    },
    // domains the interviewer covers (DSA, HR, etc.)
    domains: {
      type: [String],
      default: [],
    },
    // computed stats — updated by review transaction
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    totalInterviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // adds createdAt, updatedAt automatically
);

// ── Pre-save Hook: hash password before storing ───────────────────────────────
// Only runs when password field is modified (not on profile updates)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12); // salt rounds: 12
  next();
});

// ── Instance Method: compare plain password with stored hash ──────────────────
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
