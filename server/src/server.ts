import express, { Request, Response, NextFunction } from 'express';
import { basicAuth } from './middlewares/basicAuth'; // Ton fichier 1
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.json());

// --- 1. Route HTTP Basic ---
app.get('/api/admin/basic', basicAuth, (req: Request, res: Response) => {
    res.status(200).json({ message: 'Succès HTTP Basic !' });
});

// --- 2. Middleware Digest intégré ---
const digestAuth = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const realm = "Zone securisee";

    // Challenge si pas d'en-tête
    if (!authHeader || !authHeader.startsWith('Digest ')) {
        const nonce = crypto.randomBytes(16).toString('hex'); 
        res.setHeader('WWW-Authenticate', `Digest realm="${realm}", qop="auth", nonce="${nonce}", opaque="12345"`);
        res.status(401).json({ error: 'Authentification Digest requise.' });
        return;
    }

    // Extraction des infos de la requête
    const parts = authHeader.replace('Digest ', '').split(',').map(p => p.trim());
    const params: { [key: string]: string } = {};
    parts.forEach(part => {
        const [key, val] = part.split('=');
        if (key && val) params[key] = val.replace(/"/g, ''); 
    });

    const { username, nonce, uri, response, qop, nc, cnonce } = params;

    try {
        // C'est ici qu'on va lire ton fichier 2 (user.htdigest)
        // (Vérifie juste que le nom du fichier correspond bien)
        const fileContent = fs.readFileSync(path.join(__dirname, 'user.htdigest'), 'utf-8');
        
        // On récupère le hash à la fin de la ligne
        const HA1 = fileContent.trim().split(':')[2]; 

        if (username === 'admin') {
            const HA2 = crypto.createHash('md5').update(`${req.method}:${uri}`).digest('hex');
            const expectedResponse = crypto.createHash('md5')
                .update(`${HA1}:${nonce}:${nc}:${cnonce}:${qop}:${HA2}`)
                .digest('hex');

            if (response === expectedResponse) {
                return next(); // Bingo, le mot de passe est bon
            }
        }
    } catch (error) {
        console.error("Impossible de lire le fichier htdigest :", error);
    }

    res.status(401).json({ error: 'Identifiants Digest invalides.' });
};

// --- 3. Route HTTP Digest ---
app.get('/api/admin/digest', digestAuth, (req: Request, res: Response) => {
    res.status(200).json({ message: 'Bingo ! Connexion Digest réussie sur le port 3000.' });
});

// Lancement
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});