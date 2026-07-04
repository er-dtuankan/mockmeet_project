// src/routes/notification.routes.js
import { Router } from 'express';
import { getNotifications, markAllRead } from '../controllers/notification.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT); // all notification routes are protected
router.get('/', getNotifications);
router.patch('/read', markAllRead);

export default router;
