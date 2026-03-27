// @ts-nocheck
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { authenticateToken } from './middlewares/jwtAuth';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const demoUser = { id: 1, username: "student", password: "password123", role: "admin" };

// --- 1. ROUTE LOGIN (Mise à jour pour l'Étape 3) ---
app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (username === demoUser.username && password === demoUser.password) {
        // Génération de l'Access Token (15 min)
        const accessToken = jwt.sign(
            { id: demoUser.id, username: demoUser.username, role: demoUser.role },
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: "15m" }
        );

        // GÉNÉRATION DU REFRESH TOKEN (7 jours) - Nouveauté Étape 3
        const refreshToken = jwt.sign(
            { id: demoUser.id, username: demoUser.username },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: "7d" }
        );

        // On renvoie les DEUX jetons au client
        return res.status(200).json({ accessToken, refreshToken });
    }
    return res.status(401).json({ error: "Identifiants invalides" });
});

// --- 2. ROUTE REFRESH (Étape 3 complète) ---
app.post('/api/auth/refresh', (req: Request, res: Response) => {
    // Point 2 : On attend le refreshToken dans le corps (req.body)
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: "Refresh Token manquant." });
    }

    // Point 3 : On utilise jwt.verify avec le SECRET REFRESH
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Refresh Token invalide ou expiré." });
        }

        // Point 4 : Si valide, on génère un NOUVEAU Access Token (15m)
        const newAccessToken = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: "15m" }
        );

        // On renvoie le nouveau jeton au client
        res.status(200).json({ accessToken: newAccessToken });
    });
});

// Route de l'Étape 2
app.get('/api/profile', authenticateToken, (req: Request, res: Response) => {
    res.status(200).json({ message: "Profil protégé accessible", user: req.user });
});

app.listen(3000, () => console.log("🚀 Serveur démarré sur http://localhost:3000/api-docs/"));