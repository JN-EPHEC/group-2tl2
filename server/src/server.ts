// @ts-nocheck
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { authenticateToken } from './middlewares/jwtAuth';

/**
 * CONFIGURATION DU SERVEUR LES ARCS
 * Ce fichier gère l'authentification et l'annuaire de la station.
 * Version : 1.0.2
 */

dotenv.config();
const app = express();
const PORT = 3000;

// Configuration des Middlewares
app.use(cors({ 
    origin: "http://localhost:5173", 
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- BASE DE DONNÉES SIMULÉE ---
const demoUser = { 
    id: 1, 
    username: "student", 
    password: "password123", 
    role: "admin",
    fullName: "Utilisateur Test"
};

let usersAnnuaire = [
    { id: 1, username: "student", email: "user@lesarcs.com", dateAdded: "2024-03-20" },
    { id: 2, username: "piste_manager", email: "pistes@lesarcs.com", dateAdded: "2024-03-21" }
];

// --- LOGIQUE D'AUTHENTIFICATION ---

/**
 * POST /api/auth/login
 * Permet de connecter un utilisateur et de générer un Access Token.
 */
app.post('/api/auth/login', (req: Request, res: Response) => {
    console.log("--- Tentative de connexion ---");
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ error: "Nom d'utilisateur et mot de passe requis." });
        }

        if (username === demoUser.username && password === demoUser.password) {
            const accessToken = jwt.sign(
                { id: demoUser.id, username: demoUser.username, role: demoUser.role },
                process.env.JWT_ACCESS_SECRET as string,
                { expiresIn: "1h" }
            );

            const refreshToken = jwt.sign(
                { id: demoUser.id, username: demoUser.username },
                process.env.JWT_REFRESH_SECRET as string,
                { expiresIn: "7d" }
            );

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false, 
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, 
            });

            console.log(`✅ Utilisateur ${username} connecté avec succès.`);
            return res.status(200).json({ accessToken });
        }

        console.log("❌ Échec de connexion : Identifiants incorrects.");
        return res.status(401).json({ error: "Identifiants invalides" });
    } catch (error) {
        console.error("Erreur Login:", error);
        return res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

/**
 * GET /api/profile
 * Récupère les informations de l'utilisateur connecté (Route protégée).
 */
app.get('/api/profile', authenticateToken, (req: Request, res: Response) => {
    try {
        res.status(200).json({ 
            message: "Profil récupéré", 
            user: req.user,
            station: "Les Arcs / Paradiski"
        });
    } catch (error) {
        res.status(500).json({ error: "Impossible de charger le profil." });
    }
});

/**
 * POST /api/auth/logout
 * Déconnecte l'utilisateur en supprimant le cookie de session.
 */
app.post('/api/auth/logout', (req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Déconnexion réussie." });
});

// --- GESTION DE L'ANNUAIRE ---

/**
 * GET /api/users
 * Liste tous les contacts enregistrés dans l'annuaire.
 */
app.get('/api/users', authenticateToken, (req: Request, res: Response) => {
    console.log("--- Récupération de l'annuaire ---");
    res.status(200).json(usersAnnuaire);
});

/**
 * POST /api/users
 * Ajoute un nouveau contact à la liste.
 */
app.post('/api/users', authenticateToken, (req: Request, res: Response) => {
    const { username, email } = req.body;
    
    try {
        if (!username || !email) {
            return res.status(400).json({ error: "Le nom et l'email sont obligatoires." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Format d'email invalide." });
        }

        const newUser = { 
            id: Date.now(), 
            username, 
            email,
            dateAdded: new Date().toISOString().split('T')[0]
        };

        usersAnnuaire.push(newUser);
        console.log(`👤 Nouveau contact ajouté : ${username}`);
        
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'ajout du contact." });
    }
});

// Lancement du serveur sur le port configuré
app.listen(PORT, () => {
    console.log("==========================================");
    console.log(`🚀 SERVEUR LES ARCS OPÉRATIONNEL`);
    console.log(`📡 URL : http://localhost:${PORT}`);
    console.log(`📖 DOC : http://localhost:${PORT}/api-docs/`);
    console.log("==========================================");
});