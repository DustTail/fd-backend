import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class SessionDto {

    @Expose()
    @ApiProperty()
        accessToken: string;

    @Expose()
    @ApiProperty()
        refreshToken: string;

    @Expose()
    @ApiProperty()
    @Type(()=> Number)
        accessTokenExpireAt: number;

    @Expose()
    @ApiProperty()
    @Type(()=> Number)
        refreshTokenExpireAt: number;

    constructor(session: Record<string, unknown>) {
        Object.assign(this, session);
    }
}
