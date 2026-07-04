// src/routes/booking.routes.js
import { Router } from 'express';
import {
  createBooking, getStudentBookings, getInterviewerBookings,
  getAllBookings, updateBookingStatus,
} from '../controllers/booking.controller.js';
import { verifyJWT, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT); // all booking routes require authentication

router.post('/', createBooking);
router.get('/student', getStudentBookings);
router.get('/interviewer', getInterviewerBookings);
router.get('/all', requireRole('teacher'), getAllBookings);
router.patch('/:id/status', updateBookingStatus);

export default router;
