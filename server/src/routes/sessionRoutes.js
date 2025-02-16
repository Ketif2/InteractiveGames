import express from 'express';
import { 
  getAllSessions, 
  createSession, 
  updateSession, 
  getSessionById,
  getTotalSessionsPerWeek,
  getSessionToday
} from '../controllers/sessionController.js';

const router = express.Router();

router.get('/', getAllSessions);
router.post('/', createSession);
router.put('/:id', updateSession);
router.get('/:id', getSessionById);
router.get('/patient/:id_paciente', getTotalSessionsPerWeek);
router.get('/patient-today/:id_paciente', getSessionToday);

export default router;