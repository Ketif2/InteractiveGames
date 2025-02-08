import express from 'express';
import { 
  getAllSessions, 
  createSession, 
  updateSession, 
  getSessionById 
} from '../controllers/sessionController.js';

const router = express.Router();

router.get('/', getAllSessions);
router.post('/', createSession);
router.put('/:id', updateSession);
router.get('/:id', getSessionById);

export default router;