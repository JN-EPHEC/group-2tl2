import { Request, Response, NextFunction } from 'express';

export const basicAuth = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    // 1. Vérification de la présence du header
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Zone Admin"');
        res.status(401).json({ error: 'Authentification Basic requise.' });
        return; 
    }

    // 2. Extraction sécurisée (on vérifie que le split a bien fonctionné)
    const parts = authHeader.split(' ');
    const base64String = parts[1];

    if (!base64String) {
        res.status(401).json({ error: 'Token Basic malformé.' });
        return;
    }

    // 3. Décodage (Utilisation de Buffer)
    // Si Buffer est encore rouge, c'est qu'il manque 'npm install @types/node --save-dev'
    const credentials = Buffer.from(base64String, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    // 4. Validation des identifiants
    if (username === 'admin' && password === 'supersecret') {
        next(); 
    } else {
        res.setHeader('WWW-Authenticate', 'Basic realm="Zone Admin"');
        res.status(401).json({ error: 'Identifiants Basic invalides.' });
    }
};