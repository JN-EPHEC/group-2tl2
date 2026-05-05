import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasManyGetAssociationsMixin,
} from "sequelize";
import sequelize from "../config/database";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare nom: string;
  declare prenom: string;
  declare email: string;
  declare motDePasse: string;
  declare telephone: CreationOptional<string | null>;
  declare dateNaissance: CreationOptional<Date | null>;
  declare isAdmin: CreationOptional<boolean>;
  declare role: CreationOptional<string>;
  declare dernierLogin: CreationOptional<Date | null>;
  declare dateInscription: CreationOptional<Date>;
  declare actif: CreationOptional<boolean>;

  // Mixins associations (typage)
  declare getAdresses: HasManyGetAssociationsMixin<import("./Adresse").default>;
  declare getAbonnements: HasManyGetAssociationsMixin<import("./Abonnement").default>;
  declare getLogs: HasManyGetAssociationsMixin<import("./LogAction").default>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    motDePasse: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "mot_de_passe",
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateNaissance: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "date_naissance",
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_admin",
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "user, moderateur, super_admin",
    },
    dernierLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "dernier_login",
    },
    dateInscription: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "date_inscription",
    },
    actif: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "utilisateurs",
    timestamps: false,
  }
);

export default User;
