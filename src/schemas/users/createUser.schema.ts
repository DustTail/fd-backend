import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { validationRules } from 'src/resources/users';

export class CreateUserSchema {

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
        email: string;

    @ApiProperty({
        minLength: validationRules.passwordMinLength,
        maxLength: validationRules.passwordMaxLength
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(validationRules.passwordMinLength)
    @MaxLength(validationRules.passwordMaxLength)
        passpord: string;

}
