import type { Request, Response } from 'express';
import Abonnement from '../models/Abonnement';
import Forfait from '../models/Forfait';

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
