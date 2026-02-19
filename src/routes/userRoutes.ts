import { Router } from "express";
import * as userController from "../controllers/userController";

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
 * responses:
 * 204:
 * description: Supprimé avec succès
 */
router.delete("/:id", userController.deleteUser);

export default router;