import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { BaseDto } from 'src/common/dtos';
import { User } from 'src/models';
import { userRoles } from 'src/resources/users';

@Exclude()
export class UserDto extends BaseDto {
    @Expose()
    @ApiProperty()
        name: string;

    @Expose()
    @ApiPropertyOptional()
        picture: string;

    @Expose()
    @ApiProperty({ enum: userRoles })
    @Transform(({ value }) => userRoles[value])
        role: string;

    constructor(user: Partial<User>) {
        super(user);
        Object.assign(this, user.toJSON());
    }
}
