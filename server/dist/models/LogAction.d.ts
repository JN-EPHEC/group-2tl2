import { Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, BelongsToGetAssociationMixin } from "sequelize";
import User from "./User";
declare class LogAction extends Model<InferAttributes<LogAction>, InferCreationAttributes<LogAction>> {
    id: CreationOptional<number>;
    utilisateurId: ForeignKey<User["id"]>;
    action: string;
    detail: CreationOptional<string | null>;
    ipAddress: CreationOptional<string | null>;
    dateAction: CreationOptional<Date>;
    getUtilisateur: BelongsToGetAssociationMixin<User>;
}
export default LogAction;
//# sourceMappingURL=LogAction.d.ts.map