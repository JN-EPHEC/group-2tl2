import { Router } from 'express';
import { getLogs } from '../controllers/logController';
import { authenticateToken } from '../middlewares/jwtAuth';

const router = Router();

router.get('/', authenticateToken, getLogs);

export default router;
