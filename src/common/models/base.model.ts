import { Column, CreatedAt, DataType, Model, UpdatedAt } from 'sequelize-typescript';

export class BaseModel extends Model {

    @Column({
        allowNull: false,
        primaryKey: true,
        unique: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4()
    })
        id: string;

    @CreatedAt
        createdAt: Date;

    @UpdatedAt
        updatedAt: Date;

}
