import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes       from './routes/authRoutes';
import userRoutes       from './routes/userRoutes';
import abonnementRoutes from './routes/abonnementRoutes';

dotenv.config();

const app = express();

const allowedOrigin = process.env.CLIENT_URL ?? 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/abonnements', abonnementRoutes);

export default app;
