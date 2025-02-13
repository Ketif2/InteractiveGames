import { Router } from 'express';
import { register, login, getTherapistProfile, updateTherapistProfile, getAllMyPatients} from '../controllers/authController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, getTherapistProfile);
router.put('/profile/:id_terapeuta', verifyToken, updateTherapistProfile);
router.get('/myPatients/:id_terapeuta', verifyToken, getAllMyPatients);

export default router;
