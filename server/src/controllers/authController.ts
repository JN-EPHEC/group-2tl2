import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Email et mot de passe requis." });
    try {
        const user = await User.findOne({ where: { email } });
        const motDePasseValide = user && await bcrypt.compare(password, user.motDePasse);
        if (!motDePasseValide)
            return res.status(401).json({ error: "Identifiants invalides." });

        const accessToken = jwt.sign(
            { id: user!.id, email: user!.email, role: user!.role ?? "user" },
            process.env.JWT_ACCESS_SECRET || 'secret1',
            { expiresIn: "1h" }
        );
        const refreshToken = jwt.sign(
            { id: user!.id },
            process.env.JWT_REFRESH_SECRET || 'secret2',
            { expiresIn: "7d" }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, secure: false, sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            accessToken,
            user: {
                id: user!.id,
                nom: user!.nom,
                prenom: user!.prenom,
                email: user!.email,
                role: user!.role,
                isAdmin: user!.isAdmin,
            },
        });
    } catch {
        return res.status(500).json({ error: "Erreur serveur." });
    }
};

export const logout = (_req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Déconnecté." });
};
