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

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nom:
 *           type: string
 *           example: Dupont
 *         prenom:
 *           type: string
 *           example: Jean
 *         email:
 *           type: string
 *           example: jean@dupont.com
 *         role:
 *           type: string
 *           enum: [user, moderateur, super_admin]
 *           example: user
 *         actif:
 *           type: boolean
 *           example: true
 *         dateInscription:
 *           type: string
 *           format: date-time
 *     Abonnement:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         utilisateurId:
 *           type: integer
 *           example: 1
 *         forfaitId:
 *           type: integer
 *           example: 2
 *         dateDebut:
 *           type: string
 *           format: date
 *         dateFin:
 *           type: string
 *           format: date
 *         statut:
 *           type: string
 *           example: actif
 *         renouvellementAuto:
 *           type: boolean
 *           example: false
 *         forfait:
 *           type: object
 *           properties:
 *             nom:
 *               type: string
 *               example: PASS 1 JOUR
 *             prix:
 *               type: number
 *               example: 65
 *             dureeJours:
 *               type: integer
 *               example: 1
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Utilisateurs]
 *     summary: Liste tous les utilisateurs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Token manquant ou invalide
 *       500:
 *         description: Erreur serveur
 */
router.get('/', authenticateToken, getAllUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Utilisateurs]
 *     summary: Créer un compte utilisateur (inscription publique)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nom, prenom, email, motDePasse]
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Dupont
 *               prenom:
 *                 type: string
 *                 example: Jean
 *               email:
 *                 type: string
 *                 example: jean@dupont.com
 *               motDePasse:
 *                 type: string
 *                 example: motdepasse123
 *               telephone:
 *                 type: string
 *                 example: "0612345678"
 *               role:
 *                 type: string
 *                 enum: [user, moderateur, super_admin]
 *                 example: user
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Champs requis manquants
 *       409:
 *         description: Email déjà utilisé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     tags: [Utilisateurs]
 *     summary: Modifier un utilisateur (rôle, actif, mot de passe…)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *                 description: Sera automatiquement hashé avec bcrypt
 *               role:
 *                 type: string
 *                 enum: [user, moderateur, super_admin]
 *               actif:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.patch('/:id', authenticateToken, checkIdParam, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Utilisateurs]
 *     summary: Supprimer un utilisateur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       204:
 *         description: Utilisateur supprimé
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', authenticateToken, checkIdParam, deleteUser);

/**
 * @swagger
 * /api/users/{id}/abonnements:
 *   get:
 *     tags: [Utilisateurs]
 *     summary: Voir les abonnements actifs d'un utilisateur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des abonnements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Abonnement'
 *       401:
 *         description: Token manquant ou invalide
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id/abonnements', authenticateToken, checkIdParam, getUserAbonnements);

export default router;
