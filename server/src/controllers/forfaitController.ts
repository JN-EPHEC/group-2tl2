import type { Request, Response } from 'express';
import Forfait from '../models/Forfait';
import { log } from '../services/logService';

// GET /api/forfaits — liste tous les forfaits
export const getForfaits = async (_req: Request, res: Response) => {
    try {
        const forfaits = await Forfait.findAll({ order: [['id', 'ASC']] });
        return res.status(200).json(forfaits);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de la récupération des forfaits." });
    }
};

// POST /api/forfaits — créer un nouveau forfait
export const createForfait = async (req: Request, res: Response) => {
    const { nom, description, prix, dureeJours } = req.body;
    if (!nom || !prix || !dureeJours)
        return res.status(400).json({ error: "Champs requis manquants (nom, prix, dureeJours)." });
    try {
        const forfait = await Forfait.create({ nom, description: description ?? null, prix, dureeJours, actif: true });
        await log(
            (req as any).user?.id,
            'CREATE_FORFAIT',
            `${nom} — ${prix}€ — ${dureeJours}j`,
            req.ip ?? null
        );
        return res.status(201).json(forfait);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de la création du forfait." });
    }
};

// PUT /api/forfaits/:id — modifier nom, description, prix, dureeJours
export const updateForfait = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nom, description, prix, dureeJours } = req.body;
    try {
        const forfait = await Forfait.findByPk(id);
        if (!forfait) return res.status(404).json({ error: "Forfait introuvable." });

        if (nom !== undefined)         forfait.nom         = nom;
        if (description !== undefined) forfait.description = description;
        if (prix !== undefined)        forfait.prix        = prix;
        if (dureeJours !== undefined)  forfait.dureeJours  = dureeJours;

        await forfait.save();
        await log(
            (req as any).user?.id,
            'UPDATE_FORFAIT',
            `Forfait #${id} → ${forfait.nom} — ${forfait.prix}€ — ${forfait.dureeJours}j`,
            req.ip ?? null
        );
        return res.status(200).json(forfait);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de la modification du forfait." });
    }
};

// PUT /api/forfaits/:id/toggle — activer ou désactiver
export const toggleForfait = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const forfait = await Forfait.findByPk(id);
        if (!forfait) return res.status(404).json({ error: "Forfait introuvable." });

        forfait.actif = !forfait.actif;
        await forfait.save();
        await log(
            (req as any).user?.id,
            'TOGGLE_FORFAIT',
            `Forfait #${id} "${forfait.nom}" → ${forfait.actif ? 'activé' : 'désactivé'}`,
            req.ip ?? null
        );
        return res.status(200).json(forfait);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors du changement de statut." });
    }
};
