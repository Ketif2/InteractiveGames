import { Router } from 'express';
import {     
    getTherapistById,
    updateTherapistProfile,
    getAllMyPatients,
    getTherapists} from '../controllers/therapistController.js';
//import verifyToken from '../middlewares/authMiddleware.js';
const router = Router();

router.get('/all', /*verifyToken,*/ getTherapists);
router.get('/:id', /*verifyToken,*/ getTherapistById);
router.put('/:id', /*verifyToken,*/ updateTherapistProfile);
router.get('/:id/patients', /*verifyToken,*/ getAllMyPatients);


export default router;