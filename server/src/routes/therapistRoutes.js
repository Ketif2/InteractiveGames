import { Router } from 'express';
import {     
    getTherapistById,
    updateTherapistProfile,
    getAllMyPatients,
    getTherapists} from '../controllers/therapistController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/all', authenticate, getTherapists);
router.get('/:id', authenticate, getTherapistById);
router.put('/:id', authenticate, updateTherapistProfile);
router.get('/:id/patients', authenticate, getAllMyPatients);


export default router;