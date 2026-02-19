import type { Request, Response } from "express";
import User from "../models/User";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { nom, prenom, email } = req.body;
    const user = await User.create({ nom, prenom, email });
    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    res.status(deleted === 0 ? 404 : 204).send();
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};