import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { authenticateToken } from './middlewares/jwtAuth';
import User from './models/User'; 

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

const demoUser = { id: 1, username: "student", password: "password123", role: "admin" };

// --- ROUTES AUTH ---
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

// --- ROUTES USERS ---

app.get('/api/users', authenticateToken, async (req: Request, res: Response) => {
    try {
        const users = await User.findAll(); 
        // IMPORTANT: Si ton front-end attend 'username' mais que la base a 'name', 
        // on peut transformer les données ici pour ne pas casser l'affichage.
        const formattedUsers = users.map((u: any) => ({
            id: u.id,
            username: u.name || u.nom, // Gère les deux cas
            email: u.email,
            status: "Actif"
        }));
        res.status(200).json(formattedUsers);
    } catch (error) {
        console.error("Erreur GET:", error);
        res.status(500).json([]); // Envoie un tableau vide pour éviter la page blanche
    }
});

app.post('/api/users', authenticateToken, async (req: Request, res: Response) => {
    const { username, email } = req.body;
    if (!username || !email) return res.status(400).json({ error: "Champs requis." });

    try {
        const newUser = await User.create({ 
            name: username, // Utilise 'name' comme vu dans tes logs PostgreSQL
            email: email,
            password: "default_password_123" // Ajoute un password par défaut car ta base l'exige (NOT NULL)
        } as any); 
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Erreur POST:", error);
        res.status(500).json({ error: "Erreur base de données" });
    }
});

// --- SYNC ET START ---
User.sync({ alter: true }).then(() => {
    console.log("✅ Connecté à PostgreSQL (Supabase)");
    app.listen(PORT, () => {
        console.log(`🚀 SERVEUR: http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("❌ Erreur de connexion base de données:", err);
});