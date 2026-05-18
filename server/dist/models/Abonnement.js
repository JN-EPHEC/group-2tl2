"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
const Forfait_1 = __importDefault(require("./Forfait"));
class Abonnement extends sequelize_1.Model {
}
Abonnement.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    utilisateurId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "utilisateur_id",
        references: { model: "utilisateurs", key: "id" },
        onDelete: "RESTRICT",
    },
    forfaitId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "forfait_id",
        references: { model: "forfaits", key: "id" },
        onDelete: "RESTRICT",
    },
    dateDebut: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
        field: "date_debut",
    },
    dateFin: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
        field: "date_fin",
    },
    renouvellementAuto: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "renouvellement_auto",
    },
    statut: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        comment: "actif, expire, annule",
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: "created_at",
    },
}, {
    sequelize: database_1.default,
    modelName: "Abonnement",
    tableName: "abonnements",
    timestamps: false,
});
// ── Relations ──────────────────────────────────────────────
// (0,n) Abonnement  <----  (1,1) Utilisateur
User_1.default.hasMany(Abonnement, { foreignKey: "utilisateurId", as: "abonnements", onDelete: "RESTRICT" });
Abonnement.belongsTo(User_1.default, { foreignKey: "utilisateurId", as: "utilisateur" });
// (0,n) Abonnement  <----  (1,1) Forfait
Forfait_1.default.hasMany(Abonnement, { foreignKey: "forfaitId", as: "abonnements", onDelete: "RESTRICT" });
Abonnement.belongsTo(Forfait_1.default, { foreignKey: "forfaitId", as: "forfait" });
exports.default = Abonnement;
//# sourceMappingURL=Abonnement.js.map