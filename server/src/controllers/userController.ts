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
    const { role } = req.body; // Récupère le rôle envoyé par le client

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        // IMPORTANT : Vérifie ici si ta colonne s'appelle 'role' ou 'roleId'
        // Si c'est un ID (ex: 1 pour admin, 2 pour user), il faut adapter !
        if (role !== undefined) {
            user.role = role; 
        }

        await user.save(); // <-- TRÈS IMPORTANT, sinon ce n'est pas enregistré en DB !

        // Log de l'action
        await log((req as any).user?.id, 'CHANGE_ROLE', `User #${id} → rôle : ${role}`, req.ip ?? null);

        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de la modification du rôle" });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // 1. On supprime d'abord TOUS les abonnements liés à cet utilisateur
        await Abonnement.destroy({ where: { utilisateurId: id } });

        // 2. Maintenant qu'il est "libre", on peut supprimer l'utilisateur sans erreur de contrainte
        const deleted = await User.destroy({ where: { id } });
        
        if (deleted === 0)
            return res.status(404).json({ error: "Utilisateur non trouvé." });
            
        // 3. On enregistre le log
        await log((req as any).user?.id, 'DELETE_USER', `User #${id} supprimé`, req.ip ?? null);
        
        return res.status(204).send();
    } catch (err: any) {
        console.error("ERREUR CRASH SUPPRESSION :", err); // Ça affichera le détail dans ta console serveur si ça bloque encore
        return res.status(500).json({ error: "Erreur lors de la suppression sur le serveur." });
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
