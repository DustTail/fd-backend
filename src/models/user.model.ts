import { Column, DataType, Scopes, Table } from 'sequelize-typescript';
import { BaseModel, commonScopes } from 'src/common/models';

@Scopes(() => Object.assign({

}, commonScopes))
@Table
export class User extends BaseModel {

    @Column({
        type: DataType.STRING(100),
    })
        name: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
        email: string;

    @Column({
        type: DataType.STRING,
    })
        picture: string;

}
