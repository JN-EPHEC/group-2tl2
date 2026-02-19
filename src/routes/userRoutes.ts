import { Router } from "express";
import * as userController from "../controllers/userController";
import { checkIdParam } from "../middlewares/validationHandler"; // Import du middleware de validation

const router = Router();

/**
 * @swagger
 * /api/users:
 * get:
 * summary: Récupère la liste des utilisateurs
 * tags: [Users]
 * responses:
 * 200:
 * description: Succès
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
 * properties:
 * name:
 * type: string
 * email:
 * type: string
 * responses:
 * 201:
 * description: Utilisateur créé
 */
router.post("/", userController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 * delete:
 * summary: Supprime un utilisateur
 * tags: [Users]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * responses:
 * 204:
 * description: Supprimé avec succès
 * 400:
 * description: ID invalide
 */
// Application du middleware checkIdParam sur la route DELETE
router.delete("/:id", checkIdParam, userController.deleteUser);

export default router;