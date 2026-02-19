import express from "express";
import path from "path";
import cors from "cors"; // 1. Import de cors

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger"; 

import sequelize from "./config/database";
import userRoutes from "./routes/userRoutes";
import { requestLogger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";
import "./models/User";

const app = express();

app.use(cors()); // Autorise toutes les origines (OK pour le développement)
app.use(express.json());
app.use(requestLogger); 

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.static(path.join(process.cwd(), "public")));

app.use("/api/users", userRoutes);

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
