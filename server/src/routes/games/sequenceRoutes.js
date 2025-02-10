import express from 'express';
import { 
    saveSequenceConfig,
    saveSequenceStats,
    updateSequenceConfig,
    getSequenceSessionStats
} from '../../controllers/games/sequenceController.js';
// import { verifyToken } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
// router.use(verifyToken);

// Rutas para configuración
router.post('/session/:sessionId/config', saveSequenceConfig);
router.put('/config/:configId', updateSequenceConfig);

// Rutas para estadísticas
router.post('/config/:configId/stats', saveSequenceStats);
router.get('/session/:sessionId/stats', getSequenceSessionStats);

export default router;