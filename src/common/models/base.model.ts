import {
    Column,
    CreatedAt,
    DataType,
    Model,
    UpdatedAt
} from 'sequelize-typescript';

export class BaseModel extends Model {

    @Column({
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        type: DataType.INTEGER.UNSIGNED,
    })
        id: number;

    @CreatedAt
        createdAt: Date;

    @UpdatedAt
        updatedAt: Date;

}
