import { Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, BelongsToGetAssociationMixin } from "sequelize";
import User from "./User";
import Forfait from "./Forfait";
declare class Abonnement extends Model<InferAttributes<Abonnement>, InferCreationAttributes<Abonnement>> {
    id: CreationOptional<number>;
    utilisateurId: ForeignKey<User["id"]>;
    forfaitId: ForeignKey<Forfait["id"]>;
    dateDebut: Date;
    dateFin: Date;
    renouvellementAuto: CreationOptional<boolean>;
    statut: string;
    createdAt: CreationOptional<Date>;
    getUtilisateur: BelongsToGetAssociationMixin<User>;
    getForfait: BelongsToGetAssociationMixin<Forfait>;
}
export default Abonnement;
//# sourceMappingURL=Abonnement.d.ts.map