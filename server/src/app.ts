import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes       from './routes/authRoutes';
import userRoutes       from './routes/userRoutes';
import abonnementRoutes from './routes/abonnementRoutes';
import forfaitRoutes    from './routes/forfaitRoutes';
import logRoutes        from './routes/logRoutes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();


const app = express();

// On autorise à la fois l'adresse en ligne ET ton adresse locale (localhost)
const allowedOrigins = [
  process.env.CLIENT_URL, 
  'http://91.134.138.162:5173', 
  'http://localhost:5173'
];

app.use(cors({ 
  origin: (origin, callback) => {
    // Si l'adresse qui appelle le serveur est dans notre liste, on accepte
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqué par CORS'));
    }
  }, 
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/abonnements', abonnementRoutes);
app.use('/api/forfaits',    forfaitRoutes);
app.use('/api/logs',        logRoutes);

// ── Gestion centralisée des erreurs (doit être en dernier) ──
app.use(errorHandler);

export default app;
