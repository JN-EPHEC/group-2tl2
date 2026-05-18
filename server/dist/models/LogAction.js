"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
class LogAction extends sequelize_1.Model {
}
LogAction.init({
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
    action: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    detail: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    ipAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "ip_address",
    },
    dateAction: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: "date_action",
    },
}, {
    sequelize: database_1.default,
    modelName: "LogAction",
    tableName: "logs_actions",
    timestamps: false,
});
// ── Relations ──────────────────────────────────────────────
// (0,n) LogAction  <----  (1,1) Utilisateur
User_1.default.hasMany(LogAction, { foreignKey: "utilisateurId", as: "logs", onDelete: "CASCADE" });
LogAction.belongsTo(User_1.default, { foreignKey: "utilisateurId", as: "utilisateur" });
exports.default = LogAction;
//# sourceMappingURL=LogAction.js.map