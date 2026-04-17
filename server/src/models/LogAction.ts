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

class LogAction extends Model<
  InferAttributes<LogAction>,
  InferCreationAttributes<LogAction>
> {
  declare id: CreationOptional<number>;
  declare utilisateurId: ForeignKey<User["id"]>;
  declare action: string;
  declare detail: CreationOptional<string | null>;
  declare ipAddress: CreationOptional<string | null>;
  declare dateAction: CreationOptional<Date>;

  // Mixin association
  declare getUtilisateur: BelongsToGetAssociationMixin<User>;
}

LogAction.init(
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
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "ip_address",
    },
    dateAction: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "date_action",
    },
  },
  {
    sequelize,
    modelName: "LogAction",
    tableName: "logs_actions",
    timestamps: false,
  }
);

// ── Relations ──────────────────────────────────────────────
// (0,n) LogAction  <----  (1,1) Utilisateur
User.hasMany(LogAction, { foreignKey: "utilisateurId", as: "logs", onDelete: "CASCADE" });
LogAction.belongsTo(User, { foreignKey: "utilisateurId", as: "utilisateur" });

export default LogAction;
