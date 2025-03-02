// src/routes/games/sequenceRoutes.js
import express from 'express';
import {
    getSequenceConfig,
    saveSequenceConfig
} from '../../controllers/games/sequenceController.js';

const router = express.Router();

router.post('/save-config', saveSequenceConfig);
router.get('/config/:id_sesion', getSequenceConfig);

export default router;