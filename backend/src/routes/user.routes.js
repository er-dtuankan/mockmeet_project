// src/routes/user.routes.js
import { Router } from 'express';
import { getInterviewers, getStudents, getPublicProfile, updateProfile } from '../controllers/user.controller.js';
import { verifyJWT, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/interviewers', getInterviewers);                                   // public
router.get('/students', verifyJWT, requireRole('teacher'), getStudents);        // teacher only
router.get('/:id', getPublicProfile);                                           // public
router.patch('/me', verifyJWT, updateProfile);                                  // protected

export default router;
