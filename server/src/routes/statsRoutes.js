import { Router } from 'express';
import { 
    getStatsPerSession,
    registerStats 
} from '../controllers/statsController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/:id_sesion', authenticate, getStatsPerSession);
router.post('/register', authenticate, registerStats);

export default router;