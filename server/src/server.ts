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

// --- ROUTES AUTHENTIFICATION ---
app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { name: username } });
        // Utilisation de user.password directement
        if (user && user.password === password) {
            const accessToken = jwt.sign(
                { id: user.id, username: user.name, role: "admin" },
                process.env.JWT_ACCESS_SECRET || 'secret1',
                { expiresIn: "1h" }
            );
            const refreshToken = jwt.sign(
                { id: user.id },
                process.env.JWT_REFRESH_SECRET || 'secret2',
                { expiresIn: "7d" }
            );
            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: "strict", maxAge: 7*24*60*60*1000 });
            return res.status(200).json({ accessToken });
        }
        return res.status(401).json({ error: "Identifiants incorrects." });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur." });
    }
});

// --- ROUTES UTILISATEURS (CRUD) ---

// 1. LIRE
app.get('/api/users', authenticateToken, async (req: Request, res: Response) => {
    try {
        const users = await User.findAll(); 
        const formattedUsers = users.map((u) => ({
            id: u.id,
            username: u.name, 
            email: u.email,
        }));
        res.status(200).json(formattedUsers);
    } catch (error) {
        console.error("Erreur GET:", error);
        res.status(500).json([]); 
    }
});

// 2. CRÉER
app.post('/api/users', authenticateToken, async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    
    // DEBUG LOGS : Regarde ton terminal quand tu crées un utilisateur !
    console.log("Données reçues pour création :", { username, email, password });

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Champs requis (username, email, password)." });
    }

    try {
        const newUser = await User.create({ 
            name: username, 
            email: email,
            password: password // Utilise la variable password issue de req.body
        }); 
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Erreur POST:", error);
        res.status(500).json({ error: "Erreur base de données" });
    }
});

// 3. SUPPRIMER
app.delete('/api/users/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        await User.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: "Supprimé." });
    } catch (error) {
        res.status(500).json({ error: "Erreur." });
    }
});

// 4. MODIFIER LE MDP
app.put('/api/users/:id', authenticateToken, async (req: Request, res: Response) => {
    const { newPassword } = req.body;
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.update({ password: newPassword });
            return res.status(200).json({ message: "Mis à jour !" });
        }
        res.status(404).json({ error: "Non trouvé" });
    } catch (error) {
        res.status(500).json({ error: "Erreur." });
    }
});

// On utilise alter: true pour mettre à jour la structure sans tout supprimer
User.sync({ alter: true }).then(() => {
    console.log("✅ Base de données PostgreSQL synchronisée");
    app.listen(PORT, () => console.log(`🚀 SERVEUR: http://localhost:${PORT}`));
}).catch(err => {
    console.error("❌ Erreur Sync:", err);
});