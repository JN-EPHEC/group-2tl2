


import express from "express";
import path from "path";
import cors from "cors";
import { Database } from "./config/database";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use(errorHandler);

// Utilisation du Singleton
const sequelize = Database.getInstance();

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Serveur sur http://localhost:3000");
    console.log("DB connectée via Singleton ✅");
  });
});