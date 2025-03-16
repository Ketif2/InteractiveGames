import { Router } from 'express';
import {
    getPacientes,
    getPacienteById,
    createPaciente,
    updatePaciente,
    deletePaciente,
    assignTherapist,
    uploadDocument,
    getDocument,
    deleteDocument,
    getDocuments
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


// Rutas para documentos
router.post('/:id/documents', authenticate, uploadDocument);
router.get('/:id/documents', authenticate, getDocuments);
router.get('/:id/documents/:documentId', authenticate, getDocument);
router.delete('/:id/documents/:documentId', authenticate, deleteDocument);


export default router;
