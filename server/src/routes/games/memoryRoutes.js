import express from 'express';
import {
    getMemoryConfig,
    saveMemoryConfig
} from '../../controllers/games/memoryController.js';

const router = express.Router();

router.post('/save-config', saveMemoryConfig);
router.get('/config/:id_sesion', getMemoryConfig);

export default router;