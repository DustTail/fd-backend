import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { rules } from 'src/resources/sessions';

export class CreateSessionSchema {

    @ApiProperty({
        description: 'OAuth2 token'
    })
    @IsString()
    @IsNotEmpty()
        token: string;

    @ApiPropertyOptional({
        description: 'Set life time for session in seconds.',
        default: rules.tokenLifeTimeDefault,
        minimum: rules.tokenLifeTimeMinimum,
        maximum: rules.tokenLifeTimeMaximum
    })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Min(rules.tokenLifeTimeMinimum)
    @Max(rules.tokenLifeTimeMaximum)
    @IsPositive()
        tokenLifeTime = rules.tokenLifeTimeDefault;

}
