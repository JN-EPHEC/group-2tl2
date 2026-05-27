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
const allowedOrigin = process.env.CLIENT_URL ?? 'http://91.134.138.162:5173';
app.use(cors({ origin: allowedOrigin, credentials: true }));
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
