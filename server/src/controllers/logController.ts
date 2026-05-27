import type { Request, Response } from 'express';
import LogAction from '../models/LogAction';
import User from '../models/User';

// GET /api/logs — retourne les 100 dernières actions admin
export const getLogs = async (_req: Request, res: Response) => {
    try {
        const logs = await LogAction.findAll({
            order: [['dateAction', 'DESC']],
            limit: 100,
            include: [{ model: User, as: 'utilisateur', attributes: ['nom', 'prenom', 'email'] }],
        });
        return res.status(200).json(logs);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de la récupération des logs." });
    }
};
