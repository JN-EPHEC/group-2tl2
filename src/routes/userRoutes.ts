import { Router } from "express";
import * as userController from "../controllers/userController";

const router = Router();

// Ne remettez pas de commentaire Swagger ici, on l'a mis dans swagger.ts
router.get('/', userController.getAllUsers);

router.post("/", userController.createUser);
router.delete("/:id", userController.deleteUser);

export default router;