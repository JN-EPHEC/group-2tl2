"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    // Point 3 : Le jeton ne commence qu’à partir du 7e caractère
    const token = authHeader && authHeader.substring(7);
    if (!token) {
        return res.status(401).json({ error: "Accès refusé. Token manquant." });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token invalide ou expiré." });
        }
        // Point 4 : Stockez le payload décodé dans req.user
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=jwtAuth.js.map