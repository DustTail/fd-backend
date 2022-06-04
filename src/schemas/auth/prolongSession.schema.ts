import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProlongSessionSchema {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        refreshToken: string;

}
