import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { authenticateToken } from './middlewares/jwtAuth';

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

const demoUser = { id: 1, username: "student", password: "password123", role: "admin" };
let usersAnnuaire = [
    { id: 1, username: "student", email: "user@lesarcs.com", status: "Actif" },
    { id: 2, username: "piste", email: "pistes@lesarcs.com", status: "Actif" }
];

app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (username === demoUser.username && password === demoUser.password) {
        const accessToken = jwt.sign(
            { id: demoUser.id, username: demoUser.username, role: demoUser.role },
            process.env.JWT_ACCESS_SECRET || 'secret1',
            { expiresIn: "1h" }
        );
        const refreshToken = jwt.sign(
            { id: demoUser.id },
            process.env.JWT_REFRESH_SECRET || 'secret2',
            { expiresIn: "7d" }
        );
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: "strict", maxAge: 7*24*60*60*1000 });
        return res.status(200).json({ accessToken });
    }
    return res.status(401).json({ error: "Identifiants invalides." });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Déconnecté." });
});

app.get('/api/users', authenticateToken, (req: Request, res: Response) => {
    res.status(200).json(usersAnnuaire);
});

app.post('/api/users', authenticateToken, (req: Request, res: Response) => {
    const { username, email } = req.body;
    if (!username || !email) return res.status(400).json({ error: "Champs requis." });
    const newUser = { id: Date.now(), username, email, status: "Nouveau" };
    usersAnnuaire.push(newUser);
    res.status(201).json(newUser);
});

app.listen(PORT, () => console.log(`🚀 SERVEUR: http://localhost:${PORT}`));