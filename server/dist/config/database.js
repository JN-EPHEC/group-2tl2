"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
dotenv_1.default.config();
class Database {
    // 1. Stockage de l'instance unique
    static instance;
    // 2. Constructeur PRIVÉ : empêche de faire 'new Database()' ailleurs
    constructor() { }
    // 3. Point d'accès global à l'instance
    static getInstance() {
        if (!Database.instance) {
            console.log("--- Création de l'instance unique Sequelize (Singleton) ---");
            Database.instance = new sequelize_1.Sequelize(process.env.DATABASE_URL, {
                dialect: "postgres",
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false,
                    },
                },
            });
        }
        return Database.instance;
    }
}
exports.Database = Database;
// Pour garder la compatibilité avec tes anciens fichiers, tu peux exporter l'instance par défaut
exports.default = Database.getInstance();
//# sourceMappingURL=database.js.map