// routes/sessionRoutes.js
import { Router } from 'express';
import { getAllSessions, createSession, updateSession, getSessionById } from '../controllers/sessionController.js';

const router = Router();

router.get('/', getAllSessions);
router.post('/', createSession);
router.get('/:id', getSessionById);
router.put('/:id', updateSession);

export default router;