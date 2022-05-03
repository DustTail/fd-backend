import { Body, Controller, Delete, HttpCode, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/guards';
import { UserSession } from 'src/common/decorators';
import { UserSessionDto } from 'src/dtos';
import { CreateSessionSchema } from 'src/schemas/sessions';
import { GoogleService } from 'src/services/google/google.service';
import { SessionsService } from './sessions.service';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
    constructor(
        private readonly googleService: GoogleService,
        private readonly sessionsService: SessionsService,
    ) {}

    @Post('google')
    @ApiCreatedResponse({ type: UserSessionDto })
    @ApiOperation({
        summary: 'Create new session (Google)',
        description: `Create new session based on Google Identity Sign-In \`id_token\`.
        More info: https://developers.google.com/identity/sign-in/web/sign-in.`
    })
    async createSession(
        @Body() body: CreateSessionSchema,
    ): Promise<UserSessionDto> {
        const userData = await this.googleService.verifyToken(body.token);
        const user = await this.sessionsService.appendUserByGoogleId(userData);
        const session = await this.sessionsService.createSession(user.id, user.role);

        return new UserSessionDto(user, session);
    }

    @Delete()
    @Auth()
    @ApiOperation({
        summary: 'Destroy current session'
    })
    @HttpCode(204)
    async destroySession(
        @UserSession() session: Session
    ): Promise<void> {
        await this.sessionsService.destroySession(session.userId);
    }

}
