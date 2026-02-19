import { Model, DataTypes } from "sequelize" ;
import sequelize from "../config/database" ;
class User extends Model {
public nom!: string ;
public prenom!: string ;
}





User.init(
  {
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Contrainte d'unicité
    }
  },
  { sequelize, modelName: "User" }
);





export default User ;