// src/routes/review.routes.js
import { Router } from 'express';
import { submitReview, getReviewsForUser, checkReviewed } from '../controllers/review.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', verifyJWT, submitReview);
router.get('/user/:id', getReviewsForUser);          // public
router.get('/check/:bookingId', verifyJWT, checkReviewed);

export default router;
