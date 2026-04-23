import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { Pool } from 'pg'; // Pilote pour se connecter à PostgreSQL
import { authenticateToken } from './middlewares/jwtAuth';

dotenv.config();

const app = express();
const PORT = 3000;

// Configuration de la connexion à Supabase via l'URL du fichier .env
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test de la connexion au démarrage
pool.connect()
    .then(() => console.log("✅ Serveur relié à la base de données Supabase"))
    .catch(err => console.error("❌ Échec de connexion à la base de données :", err));

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Identifiants temporaires pour le Login (en attendant de migrer le login vers la BDD)
const demoUser = { id: 1, username: "student", password: "password123", role: "admin" };

// ── ROUTES D'AUTHENTIFICATION ─────────────────────────────────────────

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

// ── GESTION DES UTILISATEURS (Connectée à Supabase) ────────────────────

// Récupérer tous les utilisateurs depuis Supabase
app.get('/api/users', authenticateToken, async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT id, username, email, status FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erreur SQL :", error);
        res.status(500).json({ error: "Impossible de récupérer les données depuis Supabase." });
    }
});

// Ajouter un utilisateur dans Supabase
app.post('/api/users', authenticateToken, async (req: Request, res: Response) => {
    const { username, email } = req.body;
    if (!username || !email) return res.status(400).json({ error: "Champs requis." });

    try {
        const query = 'INSERT INTO users (username, email, status) VALUES ($1, $2, $3) RETURNING *';
        const values = [username, email, 'Nouveau'];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Erreur lors de la création :", error);
        res.status(500).json({ error: "Erreur lors de l'enregistrement dans Supabase." });
    }
});

app.listen(PORT, () => console.log(`🚀 SERVEUR: http://localhost:${PORT}`));