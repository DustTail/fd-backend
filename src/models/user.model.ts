import { Column, DataType, Scopes, Table } from 'sequelize-typescript';
import { BaseModel, commonScopes } from 'src/common/models';
import { userRoles } from 'src/resources/users';

@Scopes(() => Object.assign({
    byGoogleId: (googleId: string) => ({ where: { googleId } })
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
    })
        picture: string;

    @Column({
        type: DataType.STRING,
    })
        googleId: string;

    @Column({
        type: DataType.TINYINT,
        allowNull: false,
        defaultValue: userRoles.CLIENT,
        comment: `Roles: ${JSON.stringify(userRoles)}`
    })
        role: number;

}
