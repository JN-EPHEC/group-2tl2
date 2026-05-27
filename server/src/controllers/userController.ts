import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import Abonnement from '../models/Abonnement';
import Forfait from '../models/Forfait';
import { log } from '../services/logService';

const SALT_ROUNDS = 10;

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'nom', 'prenom', 'email', 'role', 'actif', 'dateInscription'],
        });
        return res.status(200).json(users);
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { nom, prenom, email, motDePasse, telephone, role } = req.body;
    if (!nom || !prenom || !email || !motDePasse)
        return res.status(400).json({ error: "Champs requis : nom, prenom, email, motDePasse." });
    try {
        const hash = await bcrypt.hash(motDePasse, SALT_ROUNDS);
        const newUser = await User.create({
            nom, prenom, email,
            motDePasse: hash,
            telephone: telephone ?? null,
            role: role ?? "user",
        });
        const { motDePasse: _, ...userSafe } = newUser.toJSON();
        return res.status(201).json(userSafe);
    } catch (err: any) {
        if (err.name === 'SequelizeUniqueConstraintError')
            return res.status(409).json({ error: "Cet email est déjà utilisé." });
        return res.status(500).json({ error: "Erreur lors de la création." });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = { ...req.body };
    try {
        if (data.motDePasse) {
            data.motDePasse = await bcrypt.hash(data.motDePasse, SALT_ROUNDS);
        }
        await User.update(data, { where: { id } });

        const adminId = (req as any).user?.id;
        const ip      = req.ip ?? null;
        if (req.body.role !== undefined)
            await log(adminId, 'CHANGE_ROLE',    `User #${id} → rôle : ${req.body.role}`,                    ip);
        if (req.body.motDePasse !== undefined)
            await log(adminId, 'RESET_PASSWORD', `User #${id} — mot de passe réinitialisé`,                  ip);
        if (req.body.actif !== undefined)
            await log(adminId, 'TOGGLE_USER',    `User #${id} → ${req.body.actif ? 'activé' : 'désactivé'}`, ip);

        return res.status(200).json({ message: "Mis à jour." });
    } catch (err: any) {
        return res.status(500).json({ error: "Erreur lors de la mise à jour." });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deleted = await User.destroy({ where: { id } });
        if (deleted === 0)
            return res.status(404).json({ error: "Utilisateur non trouvé." });
        await log((req as any).user?.id, 'DELETE_USER', `User #${id} supprimé`, req.ip ?? null);
        return res.status(204).send();
    } catch {
        return res.status(500).json({ error: "Erreur lors de la suppression." });
    }
};

export const getUserAbonnements = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const abonnements = await Abonnement.findAll({
            where: { utilisateurId: id },
            include: [{ model: Forfait, as: 'forfait', attributes: ['nom', 'prix', 'dureeJours'] }],
        });
        return res.status(200).json(abonnements);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de la récupération des abonnements." });
    }
};
