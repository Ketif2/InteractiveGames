// routes/generalStatsRoutes.js
import { Router } from 'express';
import { 
    getSessionsByPatient,
    getSessionDetails
} from '../controllers/statsController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/patient/:id_paciente/sessions', authenticate, getSessionsByPatient);
router.get('/session/:id_sesion/details', authenticate, getSessionDetails);

export default router;