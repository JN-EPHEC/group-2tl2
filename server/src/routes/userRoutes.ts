import { Router } from 'express';
import { authenticateToken } from '../middlewares/jwtAuth';
import { checkIdParam } from '../middlewares/validationHandler';
import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserAbonnements,
} from '../controllers/userController';

const router = Router();

router.get('/',            authenticateToken, getAllUsers);
router.post('/',           createUser);                                          // public — inscription
router.patch('/:id',       authenticateToken, checkIdParam, updateUser);
router.delete('/:id',      authenticateToken, checkIdParam, deleteUser);
router.get('/:id/abonnements', authenticateToken, checkIdParam, getUserAbonnements);

export default router;
