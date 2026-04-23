import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { Pool } from 'pg'; // Pilote pour se connecter à PostgreSQL
import { authenticateToken } from './middlewares/jwtAuth';
import { sequelize, User, Forfait, Abonnement } from './models/index'; // importe l'instance + enregistre tous les modèles

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

<<<<<<< HEAD
app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Email et mot de passe requis." });

    try {
        const user = await User.findOne({ where: { email } });

        if (!user || user.motDePasse !== password) {
            return res.status(401).json({ error: "Identifiants invalides." });
        }
=======
// Identifiants temporaires pour le Login (en attendant de migrer le login vers la BDD)
const demoUser = { id: 1, username: "student", password: "password123", role: "admin" };

// ── ROUTES D'AUTHENTIFICATION ─────────────────────────────────────────
>>>>>>> c733f54b4795bf8ffe71335094ba3a4ab9d3d994

        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role ?? "user" },
            process.env.JWT_ACCESS_SECRET || 'secret1',
            { expiresIn: "1h" }
        );
        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET || 'secret2',
            { expiresIn: "7d" }
        );
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: "strict", maxAge: 7*24*60*60*1000 });
        return res.status(200).json({
            accessToken,
            user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role, isAdmin: user.isAdmin },
        });
    } catch (err) {
        return res.status(500).json({ error: "Erreur serveur." });
    }
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Déconnecté." });
});

<<<<<<< HEAD
// POST /api/abonnements — crée un abonnement après checkout
app.post('/api/abonnements', async (req: Request, res: Response) => {
    const { utilisateurId, forfaitNom, prix, dureeJours } = req.body;
    if (!utilisateurId || !forfaitNom || !prix || !dureeJours)
        return res.status(400).json({ error: "Champs requis manquants." });

    try {
        // Trouve ou crée le forfait par son nom
        const [forfait] = await Forfait.findOrCreate({
            where: { nom: forfaitNom },
            defaults: { nom: forfaitNom, prix, dureeJours, actif: true },
        });

        // Calcule les dates
        const dateDebut = new Date();
        const dateFin   = new Date();
        dateFin.setDate(dateFin.getDate() + dureeJours);

        const abonnement = await Abonnement.create({
            utilisateurId,
            forfaitId: forfait.id,
            dateDebut,
            dateFin,
            statut: "actif",
            renouvellementAuto: false,
        });

        res.status(201).json(abonnement);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la création de l'abonnement." });
    }
});

// GET /api/users/:id/abonnements — forfaits d'un utilisateur
app.get('/api/users/:id/abonnements', authenticateToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const abonnements = await Abonnement.findAll({
            where: { utilisateurId: id },
            include: [{ model: Forfait, as: 'forfait', attributes: ['nom', 'prix', 'dureeJours'] }],
        });
        res.status(200).json(abonnements);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération des abonnements." });
=======
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
>>>>>>> c733f54b4795bf8ffe71335094ba3a4ab9d3d994
    }
});

// GET /api/users — liste tous les utilisateurs (depuis Supabase)
app.get('/api/users', authenticateToken, async (req: Request, res: Response) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'nom', 'prenom', 'email', 'role', 'actif', 'dateInscription'],
        });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs." });
    }
});

// POST /api/users — crée un utilisateur dans Supabase
app.post('/api/users', authenticateToken, async (req: Request, res: Response) => {
    const { nom, prenom, email, motDePasse, role } = req.body;
    if (!nom || !prenom || !email || !motDePasse) {
        return res.status(400).json({ error: "Champs requis : nom, prenom, email, motDePasse." });
    }
    try {
        const newUser = await User.create({ nom, prenom, email, motDePasse, role: role ?? "user" });
        res.status(201).json(newUser);
    } catch (err: any) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: "Cet email est déjà utilisé." });
        }
        res.status(500).json({ error: "Erreur lors de la création." });
    }
});

// PATCH /api/users/:id — met à jour un utilisateur (ex: actif)
app.patch('/api/users/:id', authenticateToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await User.update(req.body, { where: { id } });
        res.status(200).json({ message: "Mis à jour." });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la mise à jour." });
    }
});

// DELETE /api/users/:id — supprime un utilisateur
app.delete('/api/users/:id', authenticateToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await User.destroy({ where: { id } });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression." });
    }
});

// Synchronise les modèles avec Supabase, puis démarre le serveur
// alter: true → met à jour les tables existantes sans les supprimer
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Base de données synchronisée (tables créées/mises à jour)");
    app.listen(PORT, () => console.log(`🚀 SERVEUR: http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Erreur de synchronisation Sequelize :", err);
    process.exit(1);
  });