import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSessionByGoogleSchema {

    @ApiProperty({
        description: 'Google OAuth 2.0 token'
    })
    @IsString()
    @IsNotEmpty()
        token: string;

}
