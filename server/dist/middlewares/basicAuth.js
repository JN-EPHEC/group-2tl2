"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuth = void 0;
const basicAuth = (req, res, next) => {
    // 2. Récupérer l'en-tête authorization
    const authHeader = req.headers.authorization;
    // 3. Vérifier si l'en-tête existe et commence par "Basic "
    if (authHeader && authHeader.startsWith('Basic ')) {
        // Extraction de la partie après "Basic " (le Base64)
        const base64String = authHeader.split(' ')[1];
        if (base64String) {
            // 4. Utilisation de Buffer pour décoder le Base64 en texte clair
            const credentials = Buffer.from(base64String, 'base64').toString('utf-8');
            // 5. Séparer pour obtenir l'utilisateur (admin) et le mot de passe (supersecret)
            const [username, password] = credentials.split(':');
            // 6. Vérification des identifiants
            if (username === 'admin' && password === 'supersecret') {
                return next(); // Succès : on autorise l'accès
            }
        }
    }
    // Sinon, renvoyer une erreur 401 avec l'en-tête WWW-Authenticate
    res.set('WWW-Authenticate', 'Basic realm="Zone Admin"');
    return res.status(401).send('Unauthorized');
};
exports.basicAuth = basicAuth;
//# sourceMappingURL=basicAuth.js.map