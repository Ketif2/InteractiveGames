import express from 'express';
import { 
    savePuzzleConfig,
    savePuzzleStats,
    updatePuzzleConfig,
    getPuzzleSessionStats,
    savePuzzleSessionComplete,
} from '../../controllers/games/puzzleController.js';
// import { verifyToken } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
// router.use(verifyToken);

router.post('/session/:sessionId/config', savePuzzleConfig);
router.put('/config/:configId', updatePuzzleConfig);
router.post('/config/:configId/stats', savePuzzleStats);
router.get('/session/:sessionId/stats', getPuzzleSessionStats);

router.post('/session/:sessionId/complete', savePuzzleSessionComplete);

export default router;