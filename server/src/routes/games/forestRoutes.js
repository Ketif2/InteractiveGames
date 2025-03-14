import express from 'express';
import {
    getForestConfig,
    saveForestConfig
} from '../../controllers/games/forestController.js';

const router = express.Router();

router.post('/save-config', saveForestConfig);
router.get('/config/:id_sesion', getForestConfig);

export default router;