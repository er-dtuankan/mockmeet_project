// ─────────────────────────────────────────────────────────────────────────────
// src/routes/index.js — Master Router
// All sub-routers are mounted here and exported as one.
// app.js does: app.use('/api/v1', router)
// ─────────────────────────────────────────────────────────────────────────────
import { Router } from 'express';
import authRoutes         from './auth.routes.js';
import userRoutes         from './user.routes.js';
import bookingRoutes      from './booking.routes.js';
import slotRoutes         from './slot.routes.js';
import reviewRoutes       from './review.routes.js';
import notificationRoutes from './notification.routes.js';

const router = Router();

router.use('/auth',          authRoutes);         // /api/v1/auth/...
router.use('/users',         userRoutes);          // /api/v1/users/...
router.use('/bookings',      bookingRoutes);       // /api/v1/bookings/...
router.use('/slots',         slotRoutes);          // /api/v1/slots/...
router.use('/reviews',       reviewRoutes);        // /api/v1/reviews/...
router.use('/notifications', notificationRoutes);  // /api/v1/notifications/...

export default router;
