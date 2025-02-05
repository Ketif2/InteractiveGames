import { Router } from 'express';
import { login, register, getUserProfile } from '../controllers/authController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile', authenticate, getUserProfile);

export default router;
