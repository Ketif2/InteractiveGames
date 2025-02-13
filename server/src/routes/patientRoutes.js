import { Router } from 'express';
import {
    getPacientes,
    getPacienteById,
    createPaciente,
    updatePaciente,
    deletePaciente,
    assignTherapist
} from '../controllers/patientController.js';
//import verifyToken from '../middlewares/authMiddleware.js';

const router = Router();

// Comentamos temporalmente verifyToken
router.get('/all', /*verifyToken,*/ getPacientes);
router.get('/:id', /*verifyToken,*/ getPacienteById);
router.post('/new', /*verifyToken,*/ createPaciente);
router.put('/:id', /*verifyToken,*/ updatePaciente);
router.delete('/:id', /*verifyToken,*/ deletePaciente);
router.put('/:id_paciente/assign-therapist', /*verifyToken,*/ assignTherapist);

export default router;
