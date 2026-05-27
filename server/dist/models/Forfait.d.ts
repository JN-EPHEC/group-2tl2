import { Model, InferAttributes, InferCreationAttributes, CreationOptional, HasManyGetAssociationsMixin } from "sequelize";
declare class Forfait extends Model<InferAttributes<Forfait>, InferCreationAttributes<Forfait>> {
    id: CreationOptional<number>;
    nom: string;
    description: CreationOptional<string | null>;
    prix: number;
    dureeJours: number;
    actif: CreationOptional<boolean>;
    createdAt: CreationOptional<Date>;
    getAbonnements: HasManyGetAssociationsMixin<import("./Abonnement").default>;
}
export default Forfait;
//# sourceMappingURL=Forfait.d.ts.map