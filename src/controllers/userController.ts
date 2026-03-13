import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

// Logique pour récupérer tous les utilisateurs
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next(error); // Passe l'erreur au middleware errorHandler
  }
};

// Logique pour créer un utilisateur
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;
    const newUser = await User.create({ name, email });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// Logique pour supprimer un utilisateur
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};