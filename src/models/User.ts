import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class User extends Model {
  public id!: number;
  public nom!: string;
  public prenom!: string;
  public email!: string; //  TypeScript pour le mail
}

User.init(
  {
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false, 
      unique: true    
    }
  },
  {
    sequelize,
    modelName: "User",
  }
);

export default User;