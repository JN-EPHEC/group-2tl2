"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
class Adresse extends sequelize_1.Model {
}
Adresse.init({
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
        onDelete: "CASCADE",
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        comment: "principale, facturation, livraison",
    },
    rue: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    numero: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    complement: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    codePostal: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: "code_postal",
    },
    ville: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    pays: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: "Belgique",
    },
    parDefaut: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "par_defaut",
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: "created_at",
    },
}, {
    sequelize: database_1.default,
    modelName: "Adresse",
    tableName: "adresses",
    timestamps: false,
});
// ── Relations ──────────────────────────────────────────────
// (0,n) Adresse  <----  (1,1) Utilisateur
User_1.default.hasMany(Adresse, { foreignKey: "utilisateurId", as: "adresses", onDelete: "CASCADE" });
Adresse.belongsTo(User_1.default, { foreignKey: "utilisateurId", as: "utilisateur" });
exports.default = Adresse;
//# sourceMappingURL=Adresse.js.map