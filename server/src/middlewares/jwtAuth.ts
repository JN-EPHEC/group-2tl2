// @ts-nocheck
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  
  // Point 3 : Le jeton ne commence qu’à partir du 7e caractère
  const token = authHeader && authHeader.substring(7);

  if (!token) {
    return res.status(401).json({ error: "Accès refusé. Token manquant." });
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET as string, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token invalide ou expiré." });
    }
    // Point 4 : Stockez le payload décodé dans req.user
    req.user = user;
    next();
  });
};