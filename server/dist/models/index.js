"use strict";
// Ce fichier importe tous les modèles pour s'assurer que :
// 1. Chaque modèle est enregistré sur l'instance Sequelize
// 2. Toutes les associations (hasMany / belongsTo) sont déclarées
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogAction = exports.Abonnement = exports.Forfait = exports.Adresse = exports.User = exports.sequelize = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.sequelize = database_1.default;
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const Adresse_1 = __importDefault(require("./Adresse")); // déclare User.hasMany(Adresse) + Adresse.belongsTo(User)
exports.Adresse = Adresse_1.default;
const Forfait_1 = __importDefault(require("./Forfait"));
exports.Forfait = Forfait_1.default;
const Abonnement_1 = __importDefault(require("./Abonnement")); // déclare User.hasMany(Abonnement), Forfait.hasMany(Abonnement) + inverses
exports.Abonnement = Abonnement_1.default;
const LogAction_1 = __importDefault(require("./LogAction")); // déclare User.hasMany(LogAction) + LogAction.belongsTo(User)
exports.LogAction = LogAction_1.default;
//# sourceMappingURL=index.js.map