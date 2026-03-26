// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = "ma_cle_secrete_hyper_longue_123";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json({ error: "Token invalide." });
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ error: "Jeton manquant." });
    }
};