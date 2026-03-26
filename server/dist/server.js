"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
// Importation du middleware créé à l'étape 1
const basicAuth_1 = require("./middlewares/basicAuth");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes existantes
app.use("/api/users", userRoutes_1.default);
/** * 7. Protégez une nouvelle route GET /api/admin/basic avec ce middleware
 */
app.get("/api/admin/basic", basicAuth_1.basicAuth, (req, res) => {
    res.status(200).send("Accès autorisé : Bienvenue dans la zone admin !");
});
// Le Error Handler doit toujours être en dernier
app.use(errorHandler_1.errorHandler);
// Utilisation du Singleton pour la Database
const sequelize = database_1.Database.getInstance();
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
//# sourceMappingURL=server.js.map