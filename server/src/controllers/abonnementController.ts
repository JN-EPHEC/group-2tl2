import type { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import Abonnement from '../models/Abonnement';
import Forfait from '../models/Forfait';
import sequelize from '../config/database';

export const getStats = async (_req: Request, res: Response) => {
    try {
        const parMois = await sequelize.query<{ mois: string; total: number }>(
            `SELECT to_char(date_trunc('month', created_at), 'YYYY-MM') AS mois,
                    COUNT(id)::int AS total
             FROM abonnements
             WHERE created_at >= NOW() - INTERVAL '12 months'
             GROUP BY date_trunc('month', created_at)
             ORDER BY date_trunc('month', created_at) ASC`,
            { type: QueryTypes.SELECT }
        );

        const parForfait = await sequelize.query<{ nom: string; total: number }>(
            `SELECT f.nom, COUNT(a.id)::int AS total
             FROM abonnements a
             JOIN forfaits f ON a.forfait_id = f.id
             GROUP BY f.id, f.nom
             ORDER BY total DESC`,
            { type: QueryTypes.SELECT }
        );

        const parMoisParForfait = await sequelize.query<{ mois: string; forfait: string; total: number }>(
            `SELECT to_char(date_trunc('month', a.created_at), 'YYYY-MM') AS mois,
                    f.nom AS forfait,
                    COUNT(a.id)::int AS total
             FROM abonnements a
             JOIN forfaits f ON a.forfait_id = f.id
             WHERE a.created_at >= NOW() - INTERVAL '12 months'
             GROUP BY date_trunc('month', a.created_at), f.id, f.nom
             ORDER BY date_trunc('month', a.created_at) ASC, f.nom`,
            { type: QueryTypes.SELECT }
        );

        return res.status(200).json({ parMois, parForfait, parMoisParForfait });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de la récupération des statistiques." });
    }
};

export const createAbonnement = async (req: Request, res: Response) => {
    const { utilisateurId, forfaitNom, prix, dureeJours } = req.body;
    if (!utilisateurId || !forfaitNom || !prix || !dureeJours)
        return res.status(400).json({ error: "Champs requis manquants." });
    try {
        const [forfait] = await Forfait.findOrCreate({
            where: { nom: forfaitNom },
            defaults: { nom: forfaitNom, prix, dureeJours, actif: true },
        });

        const dateDebut = new Date();
        const dateFin   = new Date();
        dateFin.setDate(dateFin.getDate() + dureeJours);

        const abonnement = await Abonnement.create({
            utilisateurId,
            forfaitId: forfait.id,
            dateDebut,
            dateFin,
            statut: "actif",
            renouvellementAuto: false,
        });
        return res.status(201).json(abonnement);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de la création de l'abonnement." });
    }
};
