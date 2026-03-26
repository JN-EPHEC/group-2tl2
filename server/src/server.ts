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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const demoUser = { id: 1, username: "student", password: "password123", role: "admin" };

app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (username === demoUser.username && password === demoUser.password) {
        const accessToken = jwt.sign(
            { id: demoUser.id, username: demoUser.username, role: demoUser.role },
            process.env.JWT_ACCESS_SECRET!,
            { expiresIn: "15m" }
        );
        return res.status(200).json({ accessToken });
    }
    return res.status(401).json({ error: "Identifiants invalides" });
});

// Point 6 : Protégez une route GET /api/profile
app.get('/api/profile', authenticateToken, (req: Request, res: Response) => {
    res.status(200).json({ message: "Profil protégé accessible", user: req.user });
});

app.listen(3000, () => console.log("🚀 Serveur démarré"));