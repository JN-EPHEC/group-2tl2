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

// Middlewares obligatoires
app.use(express.json());
app.use(cookieParser());

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const demoUser = { 
    id: 1, 
    username: "student", 
    password: "password123", 
    role: "admin" 
};

// --- 1. ROUTE LOGIN ---
app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (username === demoUser.username && password === demoUser.password) {
        
        // MODIFICATION POUR LE TEST : "30s" au lieu de "15m"
        const accessToken = jwt.sign(
            { id: demoUser.id, username: demoUser.username, role: demoUser.role },
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: "30s" } 
        );

        // REFRESH TOKEN (7 jours)
        const refreshToken = jwt.sign(
            { id: demoUser.id, username: demoUser.username },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: "7d" }
        );

        // Envoi du Cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, 
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });

        return res.status(200).json({ accessToken, refreshToken });
    }
    return res.status(401).json({ error: "Identifiants invalides" });
});

// --- 2. ROUTE REFRESH ---
app.post('/api/auth/refresh', (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: "Refresh Token manquant." });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Refresh Token invalide ou expiré." });
        }

        // On redonne un token normal de 15 minutes
        const newAccessToken = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: "15m" }
        );

        res.status(200).json({ accessToken: newAccessToken });
    });
});

// --- 3. ROUTE PROFILE ---
app.get('/api/profile', authenticateToken, (req: Request, res: Response) => {
    res.status(200).json({ message: "Profil protégé accessible", user: req.user });
});

// --- 4. ROUTE LOGOUT ---
app.post('/api/auth/logout', (req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Déconnexion réussie. Cookie supprimé." });
});

app.listen(3000, () => console.log("🚀 Serveur démarré sur http://localhost:3000/api-docs/"));