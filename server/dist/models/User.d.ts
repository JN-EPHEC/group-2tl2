import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
declare class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    id: CreationOptional<number>;
    name: string;
    email: string;
    password: string;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
}
export default User;
//# sourceMappingURL=User.d.ts.map