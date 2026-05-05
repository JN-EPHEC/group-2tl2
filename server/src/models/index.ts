// Ce fichier importe tous les modèles pour s'assurer que :
// 1. Chaque modèle est enregistré sur l'instance Sequelize
// 2. Toutes les associations (hasMany / belongsTo) sont déclarées

import sequelize from "../config/database";

import User from "./User";
import Adresse from "./Adresse";       // déclare User.hasMany(Adresse) + Adresse.belongsTo(User)
import Forfait from "./Forfait";
import Abonnement from "./Abonnement"; // déclare User.hasMany(Abonnement), Forfait.hasMany(Abonnement) + inverses
import LogAction from "./LogAction";   // déclare User.hasMany(LogAction) + LogAction.belongsTo(User)

export { sequelize, User, Adresse, Forfait, Abonnement, LogAction };
