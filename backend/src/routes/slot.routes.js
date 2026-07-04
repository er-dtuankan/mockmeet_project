// src/routes/slot.routes.js
import { Router } from 'express';
import { createSlot, getMySlots, getAvailableSlots, deleteSlot } from '../controllers/slot.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', verifyJWT, createSlot);
router.get('/my', verifyJWT, getMySlots);
router.get('/:interviewerId/available', getAvailableSlots); // public — students browse
router.delete('/:id', verifyJWT, deleteSlot);

export default router;
