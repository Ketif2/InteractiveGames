import { Router } from 'express';
import { register, login, verifyToken, logout} from '../controllers/authController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Rutas protegidas
router.get('/verify', authenticate, verifyToken);

export default router;