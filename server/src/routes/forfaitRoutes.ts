import { Router } from 'express';
import { getForfaits, createForfait, updateForfait, toggleForfait } from '../controllers/forfaitController';
import { authenticateToken } from '../middlewares/jwtAuth';

const router = Router();

router.get('/',           authenticateToken, getForfaits);
router.post('/',          authenticateToken, createForfait);
router.put('/:id',        authenticateToken, updateForfait);
router.put('/:id/toggle', authenticateToken, toggleForfait);

export default router;
