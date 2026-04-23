import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  BelongsToGetAssociationMixin,
} from "sequelize";
import sequelize from "../config/database";
import User from "./User";

class Adresse extends Model<
  InferAttributes<Adresse>,
  InferCreationAttributes<Adresse>
> {
  declare id: CreationOptional<number>;
  declare utilisateurId: ForeignKey<User["id"]>;
  declare type: CreationOptional<string | null>;
  declare rue: string;
  declare numero: CreationOptional<string | null>;
  declare complement: CreationOptional<string | null>;
  declare codePostal: string;
  declare ville: string;
  declare pays: CreationOptional<string>;
  declare parDefaut: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;

  // Mixin association
  declare getUtilisateur: BelongsToGetAssociationMixin<User>;
}

Adresse.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    utilisateurId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "utilisateur_id",
      references: { model: "utilisateurs", key: "id" },
      onDelete: "CASCADE",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "principale, facturation, livraison",
    },
    rue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    complement: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    codePostal: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "code_postal",
    },
    ville: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pays: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Belgique",
    },
    parDefaut: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "par_defaut",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    sequelize,
    modelName: "Adresse",
    tableName: "adresses",
    timestamps: false,
  }
);

// ── Relations ──────────────────────────────────────────────
// (0,n) Adresse  <----  (1,1) Utilisateur
User.hasMany(Adresse, { foreignKey: "utilisateurId", as: "adresses", onDelete: "CASCADE" });
Adresse.belongsTo(User, { foreignKey: "utilisateurId", as: "utilisateur" });

export default Adresse;
