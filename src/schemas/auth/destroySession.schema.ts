import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DestroySessionSchema {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        refreshToken: string;

}
