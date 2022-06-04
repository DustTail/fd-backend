import { Column, DataType, Scopes, Table } from 'sequelize-typescript';
import { BaseModel, commonScopes } from 'src/common/models';
import { userRoles } from 'src/resources/users';

@Scopes(() => Object.assign({
    byEmail: (email: string) => ({ where: { email } })
}, commonScopes))
@Table
export class User extends BaseModel {

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
        name: string;

    @Column({
        type: DataType.STRING(100),
    })
        email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
        password: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
        salt: string;

    @Column({
        type: DataType.STRING,
    })
        picture: string;

    @Column({
        type: DataType.TINYINT,
        allowNull: false,
        defaultValue: userRoles.CLIENT,
        comment: `Roles: ${JSON.stringify(userRoles)}`
    })
        role: number;

}
