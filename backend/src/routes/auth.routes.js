// src/routes/auth.routes.js
import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);     // POST /api/v1/auth/register
router.post('/login', login);           // POST /api/v1/auth/login
router.get('/me', verifyJWT, getMe);    // GET  /api/v1/auth/me (protected)

export default router;
