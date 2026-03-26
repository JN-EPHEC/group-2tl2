import express from "express";
import path from "path";
import cors from "cors";
import { Database } from "./config/database";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";
// Importation du middleware créé à l'étape 1
import { basicAuth } from "./middlewares/basicAuth";

const app = express();
app.use(cors());
app.use(express.json());

// Routes existantes
app.use("/api/users", userRoutes);

/** * 7. Protégez une nouvelle route GET /api/admin/basic avec ce middleware 
 */
app.get("/api/admin/basic", basicAuth, (req, res) => {
  res.status(200).send("Accès autorisé : Bienvenue dans la zone admin !");
});

// Le Error Handler doit toujours être en dernier
app.use(errorHandler);

// Utilisation du Singleton pour la Database
const sequelize = Database.getInstance();

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("-------------------------------------------------------");
    console.log("🚀 Serveur sur http://localhost:3000");
    console.log("DB connectée via Singleton ✅");
    console.log("🔐 Route Basic Auth : http://localhost:3000/api/admin/basic");
    console.log("-------------------------------------------------------");
  });
}).catch((err) => {
  console.error("Impossible de démarrer le serveur : Erreur DB", err.message);
});