import type { Request, Response } from "express";
import User from "../models/User";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    // Harmonisation : on utilise 'name' et 'email' comme dans Swagger
    const { name, email } = req.body; 
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id } });
    
    if (deleted === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};