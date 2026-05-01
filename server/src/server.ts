import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import { sequelize } from './models/index';
import authRoutes       from './routes/authRoutes';
import userRoutes       from './routes/userRoutes';
import abonnementRoutes from './routes/abonnementRoutes';

dotenv.config();

const app  = express();
const PORT = 3000;

// ── Middlewares globaux ─────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/abonnements', abonnementRoutes);

// ── Démarrage ──────────────────────────────────────────────
sequelize
    .sync({ alter: true })
    .then(() => {
        console.log("✅ Base de données synchronisée");
        app.listen(PORT, () => console.log(`🚀 SERVEUR: http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error("❌ Erreur de synchronisation Sequelize :", err);
        process.exit(1);
    });
