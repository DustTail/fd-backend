import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSessionSchema {

    @ApiProperty({
        description: 'OAuth2 token'
    })
    @IsString()
    @IsNotEmpty()
        token: string;

}
