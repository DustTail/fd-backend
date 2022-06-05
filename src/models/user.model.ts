import { BeforeCreate, BeforeUpdate, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import { BaseModel, commonScopes } from 'src/common/models';
import { userRoles } from 'src/resources/users';
import { PasswordHelper } from 'src/utils/password.helper';

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
        allowNull: true
    })
        password: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
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

    @BeforeCreate
    static createPassword(instance: User): void {
        if (instance.password) {
            instance.salt = PasswordHelper.generateSalt();
            instance.password = PasswordHelper.hash(`${instance.password}${instance.salt}${process.env.SECRET_SALT}`);
        }
    }

    @BeforeUpdate
    static updatePassword(instance: User): void {
        if (instance.password && instance.changed('password')) {
            instance.salt = PasswordHelper.generateSalt();
            instance.password = PasswordHelper.hash(`${instance.password}${instance.salt}${process.env.SECRET_SALT}`);
        }
    }

}
