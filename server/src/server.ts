// @ts-nocheck
import express, { Request, Response, NextFunction } from 'express';
import { basicAuth } from './middlewares/basicAuth'; 
import { authenticateJWT } from './middlewares/jwtAuth'; 
import { swaggerSpec } from './config/swagger'; // Ton fichier de config Swagger
import swaggerUi from 'swagger-ui-express'; // L'interface visuelle
import jwt from 'jsonwebtoken';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.json());

// --- LA LIGNE MAGIQUE POUR SWAGGER ---
// C'est elle qui transforme le texte moche en interface visuelle
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const ACCESS_TOKEN_SECRET = "ma_cle_secrete_123";

// --- ROUTES ---

app.get('/api/admin/basic', basicAuth, (req, res) => {
    res.status(200).json({ message: 'Succès HTTP Basic !' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'supersecret') {
        const accessToken = jwt.sign({ name: 'admin' }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.json({ accessToken });
    } else {
        res.status(401).json({ error: "Identifiants incorrects." });
    }
});

app.get('/api/admin/jwt', authenticateJWT, (req, res) => {
    res.json({ message: "Zone JWT OK", user: req.user });
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});