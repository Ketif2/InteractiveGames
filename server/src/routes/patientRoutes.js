import { Router } from 'express';
import {
    getPacientes,
    getPacienteById,
    createPaciente,
    updatePaciente,
    deletePaciente,
    assignTherapist
} from '../controllers/patientController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = Router();

// Todas las rutas usan el middleware authenticate
router.get('/all', authenticate, getPacientes);
router.post('/new', authenticate, createPaciente);
router.get('/:id', authenticate, getPacienteById);
router.put('/:id', authenticate, updatePaciente);
router.delete('/:id', authenticate, deletePaciente);
router.put('/:id_paciente/assign-therapist', authenticate, assignTherapist);

export default router;
