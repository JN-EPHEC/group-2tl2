import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasManyGetAssociationsMixin,
} from "sequelize";
import sequelize from "../config/database";

class Forfait extends Model<
  InferAttributes<Forfait>,
  InferCreationAttributes<Forfait>
> {
  declare id: CreationOptional<number>;
  declare nom: string;
  declare description: CreationOptional<string | null>;
  declare prix: number;
  declare dureeJours: number;
  declare actif: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;

  // Mixin association
  declare getAbonnements: HasManyGetAssociationsMixin<import("./Abonnement").default>;
}

Forfait.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    prix: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    dureeJours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "duree_jours",
    },
    actif: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    modelName: "Forfait",
    tableName: "forfaits",
    timestamps: false,
  }
);

export default Forfait;
