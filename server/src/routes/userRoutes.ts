import { Router } from "express";
import * as userController from "../controllers/userController";
import { checkIdParam } from "../middlewares/validationHandler";

const router = Router();

/**
 * @swagger
 * /api/users:
 * get:
 * summary: Récupère la liste de tous les utilisateurs
 * tags: [Users]
 * responses:
 * 200:
 * description: Liste des utilisateurs récupérée avec succès
 * 500:
 * description: Erreur interne du serveur
 */
router.get("/", userController.getAllUsers);

/**
 * @swagger
 * /api/users:
 * post:
 * summary: Crée un nouvel utilisateur
 * tags: [Users]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - name
 * - email
 * properties:
 * name:
 * type: string
 * email:
 * type: string
 * responses:
 * 201:
 * description: Utilisateur créé avec succès
 * 400:
 * description: Données invalides fournies
 * 500:
 * description: Erreur lors de la création
 */
router.post("/", userController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 * delete:
 * summary: Supprime un utilisateur par son ID
 * tags: [Users]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: ID numérique de l'utilisateur
 * responses:
 * 204:
 * description: Utilisateur supprimé avec succès
 * 400:
 * description: ID invalide (format incorrect)
 * 404:
 * description: Utilisateur non trouvé
 * 500:
 * description: Erreur lors de la suppression
 */
router.delete("/:id", checkIdParam, userController.deleteUser);

export default router;