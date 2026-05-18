import { Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, BelongsToGetAssociationMixin } from "sequelize";
import User from "./User";
declare class Adresse extends Model<InferAttributes<Adresse>, InferCreationAttributes<Adresse>> {
    id: CreationOptional<number>;
    utilisateurId: ForeignKey<User["id"]>;
    type: CreationOptional<string | null>;
    rue: string;
    numero: CreationOptional<string | null>;
    complement: CreationOptional<string | null>;
    codePostal: string;
    ville: string;
    pays: CreationOptional<string>;
    parDefaut: CreationOptional<boolean>;
    createdAt: CreationOptional<Date>;
    getUtilisateur: BelongsToGetAssociationMixin<User>;
}
export default Adresse;
//# sourceMappingURL=Adresse.d.ts.map