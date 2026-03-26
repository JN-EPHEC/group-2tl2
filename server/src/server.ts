import express from "express";
import cors from "cors";
import path from "path";
// Utilisation de require pour supprimer l'erreur de type
const auth = require('http-auth'); 
import { Database } from "./config/database";
import { errorHandler } from "./middlewares/errorHandler";
import { basicAuth } from "./middlewares/basicAuth";

const app = express();
app.use(cors());
app.use(express.json());

// 1. Configuration du realm et du fichier source (Strictement ton énoncé)
const digest = auth.digest({ 
  realm: "Zone securisee",
  file: path.join(__dirname, "../users.htdigest") 
});

// 2. Route protégée (Adaptée pour supprimer le rouge sur req.user)
app.get('/api/admin/digest', auth.connect(digest), (req: any, res: any) => { 
  res.json({ message: `Bienvenue dans la zone Digest, ${req.user} !` }); 
});

// Route Basic Auth (Précédente)
app.get("/api/admin/basic", basicAuth, (req, res) => {
  res.status(200).send("Accès autorisé : Bienvenue dans la zone admin (Basic) !");
});

app.use(errorHandler);

const PORT = 3000;
const sequelize = Database.getInstance();

sequelize.sync()
  .catch(() => console.log("⚠️ DB non connectée."))
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`✅ Serveur prêt sur http://localhost:${PORT}`);
    });
  });