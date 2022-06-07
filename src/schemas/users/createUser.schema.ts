import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { passwordRegex, validationRules } from 'src/resources/users';

export class CreateUserSchema {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        name: string;

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
    @Matches(passwordRegex)
    @MinLength(validationRules.passwordMinLength)
    @MaxLength(validationRules.passwordMaxLength)
        password: string;

}
