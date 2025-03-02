// src/routes/games/puzzleRoutes.js
import express from 'express';
import {
    getPuzzleConfig,
    savePuzzleConfig
} from '../../controllers/games/puzzleController.js';

const router = express.Router();

router.post('/save-config', savePuzzleConfig);
router.get('/config/:id_sesion', getPuzzleConfig);

export default router;