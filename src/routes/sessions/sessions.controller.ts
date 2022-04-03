import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSessionSchema } from 'src/schemas/sessions';
import { GoogleService } from 'src/services/google/google.service';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
    constructor(
        private readonly googleService: GoogleService,
    ) {}

    @Post()
    @ApiCreatedResponse()
    @ApiOperation({
        summary: 'Create new session',
        description: `Create new session based on Google Identity Sign-In \`id_token\`.
        More info: https://developers.google.com/identity/sign-in/web/sign-in.
        Field \`tokenLifeTime\` exist for testing purpose only.`
    })
    async createSession(@Body() body: CreateSessionSchema): Promise<boolean> {
        const userData = await this.googleService.verifyToken(body.token);

        return true;
    }

}
