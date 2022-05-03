import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { Model } from 'sequelize';
import { BaseModel } from 'src/common/models';

@Exclude()
export class BaseDto {

    @Expose()
    @ApiProperty()
    @Type(()=> Number)
        id: number;

    @Expose()
    @ApiProperty({ type: () => Date })
    @Type(()=> Date)
        createdAt: Date;

    @Expose()
    @ApiProperty({ type: () => Date })
    @Type(()=> Date)
        updatedAt: Date;

    constructor(baseModel: Partial<BaseModel>) {
        const model = baseModel instanceof Model ? baseModel.toJSON() : baseModel;
        Object.assign(this, model);
    }

}
