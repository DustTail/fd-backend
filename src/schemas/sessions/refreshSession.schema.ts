import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshSessionSchema {

    @ApiProperty({
        description: 'JWT refresh token'
    })
    @IsString()
    @IsNotEmpty()
        refreshToken: string;

}
