import { Router } from 'express';
import { getGames, saveGameResults, getGameConfig } from '../controllers/gameController.js';

const router = Router();

router.get('/', getGames);
router.get('/:id/config', getGameConfig);
router.post('/:id/results', saveGameResults);

export default router;