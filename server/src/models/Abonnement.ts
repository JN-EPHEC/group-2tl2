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
import Forfait from "./Forfait";

class Abonnement extends Model<
  InferAttributes<Abonnement>,
  InferCreationAttributes<Abonnement>
> {
  declare id: CreationOptional<number>;
  declare utilisateurId: ForeignKey<User["id"]>;
  declare forfaitId: ForeignKey<Forfait["id"]>;
  declare dateDebut: Date;
  declare dateFin: Date;
  declare renouvellementAuto: CreationOptional<boolean>;
  declare statut: string;
  declare createdAt: CreationOptional<Date>;

  // Mixins associations
  declare getUtilisateur: BelongsToGetAssociationMixin<User>;
  declare getForfait: BelongsToGetAssociationMixin<Forfait>;
}

Abonnement.init(
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
      onDelete: "RESTRICT",
    },
    forfaitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "forfait_id",
      references: { model: "forfaits", key: "id" },
      onDelete: "RESTRICT",
    },
    dateDebut: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "date_debut",
    },
    dateFin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "date_fin",
    },
    renouvellementAuto: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "renouvellement_auto",
    },
    statut: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "actif, expire, annule",
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
    modelName: "Abonnement",
    tableName: "abonnements",
    timestamps: false,
  }
);

// ── Relations ──────────────────────────────────────────────
// (0,n) Abonnement  <----  (1,1) Utilisateur
User.hasMany(Abonnement, { foreignKey: "utilisateurId", as: "abonnements", onDelete: "RESTRICT" });
Abonnement.belongsTo(User, { foreignKey: "utilisateurId", as: "utilisateur" });

// (0,n) Abonnement  <----  (1,1) Forfait
Forfait.hasMany(Abonnement, { foreignKey: "forfaitId", as: "abonnements", onDelete: "RESTRICT" });
Abonnement.belongsTo(Forfait, { foreignKey: "forfaitId", as: "forfait" });

export default Abonnement;
