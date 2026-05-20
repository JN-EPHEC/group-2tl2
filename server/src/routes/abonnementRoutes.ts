import { Router } from 'express';
import { createAbonnement, getStats } from '../controllers/abonnementController';
import { authenticateToken } from '../middlewares/jwtAuth';

const router = Router();

router.get('/stats', authenticateToken, getStats);
router.post('/', createAbonnement);

export default router;
