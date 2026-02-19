import express from "express";
import path from "path";

// Imports Swagger
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger"; 

import sequelize from "./config/database";
import userRoutes from "./routes/userRoutes";
import { requestLogger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";
import "./models/User";

const app = express();

app.use(express.json());

// Activation du logger global
app.use(requestLogger); 

// Activation de Swagger (En premier de la liste des routes)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Dossier public
app.use(express.static(path.join(process.cwd(), "public")));

// API users
app.use("/api/users", userRoutes);

// GESTION DES ERREURS : Doit être la dernière étape !
app.use(errorHandler);

sequelize
  .sync()
  .then(() => {
    console.log("Base de données synchronisée");
    app.listen(3000, () => {
      console.log("Serveur lancé sur http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Erreur DB:", err);
  });
