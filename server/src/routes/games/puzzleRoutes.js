import express from 'express';
import { 
    savePuzzleConfig,
    savePuzzleStats,
    updatePuzzleConfig,
    getPuzzleSessionStats
} from '../../controllers/games/puzzleController.js';
// import { verifyToken } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
// router.use(verifyToken);

// Rutas para configuración
router.post('/session/:sessionId/config', savePuzzleConfig);
router.put('/config/:configId', updatePuzzleConfig);

// Rutas para estadísticas
router.post('/config/:configId/stats', savePuzzleStats);
router.get('/session/:sessionId/stats', getPuzzleSessionStats);

export default router;