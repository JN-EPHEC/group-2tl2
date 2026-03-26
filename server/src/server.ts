import express from "express";
import cors from "cors";
import path from "path";
// Utilisation de require pour éviter les erreurs de types TypeScript (le "rouge")
const auth = require('http-auth'); 
const authConnect = require('http-auth-connect'); 

import { Database } from "./config/database";
import { errorHandler } from "./middlewares/errorHandler";
import { basicAuth } from "./middlewares/basicAuth";

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. CONFIGURATION DIGEST ---
// Le realm doit correspondre EXACTEMENT à celui de mufasa dans ton fichier .htdigest
const digest = auth.digest({ 
  realm: "Zone securisee",
  file: path.resolve(process.cwd(), "users.htdigest") 
});

// --- 2. ROUTES ---

// Route Basic Auth (Exercice précédent)
app.get("/api/admin/basic", basicAuth, (req, res) => {
  res.status(200).send("Accès autorisé : Bienvenue dans la zone admin (Basic) !");
});

// Route Digest Auth (Nouvelle route avec req.user)
// On utilise authConnect pour transformer la config digest en middleware Express
app.get('/api/admin/digest', authConnect(digest), (req: any, res: any) => { 
  res.json({ message: `Bienvenue dans la zone Digest, ${req.user} !` }); 
});

// --- 3. GESTION DES ERREURS ET DÉMARRAGE ---

app.use(errorHandler);

const PORT = 3000;
const sequelize = Database.getInstance();

sequelize.sync()
  .catch(() => console.log("⚠️ DB non connectée, mais le serveur démarre..."))
  .finally(() => {
    app.listen(PORT, () => {
      console.log("-------------------------------------------------------");
      console.log(`🚀 Serveur prêt sur http://localhost:${PORT}`);
      console.log(`🔐 Test Digest : http://localhost:${PORT}/api/admin/digest`);
      console.log("-------------------------------------------------------");
    });
  });