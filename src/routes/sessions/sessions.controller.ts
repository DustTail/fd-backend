import { Body, Controller, Delete, Post, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { Auth } from 'src/auth/guards';
import { UserSession } from 'src/common/decorators';
import { CreateSessionSchema } from 'src/schemas/sessions';
import { GoogleService } from 'src/services/google.service';

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
    async createSession(
        @Body() body: CreateSessionSchema,
        @Res({ passthrough: true }) res: FastifyReply
    ): Promise<boolean> {
        const userData = await this.googleService.verifyToken(body.token);

        // TODO:
        res.setCookie('token', 'session-token');

        return true;
    }

    @Delete()
    @Auth({})
    @ApiOperation({
        summary: 'Destroy current session'
    })
    async destroySession(
        @UserSession() session: Session
    ): Promise<boolean> {
        return true;
    }

}
