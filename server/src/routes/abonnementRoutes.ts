import { Router } from 'express';
import { createAbonnement } from '../controllers/abonnementController';

const router = Router();

router.post('/', createAbonnement);

export default router;
