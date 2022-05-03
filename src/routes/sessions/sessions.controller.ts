import { Body, Controller, Delete, HttpCode, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/guards';
import { UserSession } from 'src/common/decorators';
import { SessionDto, UserSessionDto } from 'src/dtos';
import { CreateSessionSchema, RefreshSessionSchema } from 'src/schemas/sessions';
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
    async createGoogleSession(
        @Body() body: CreateSessionSchema,
    ): Promise<UserSessionDto> {
        const userData = await this.googleService.verifyToken(body.token);
        const user = await this.sessionsService.appendUserByGoogleId(userData);
        const session = await this.sessionsService.createSession(user.id, user.role);

        return new UserSessionDto(user, session);
    }

    @Put()
    @ApiOkResponse({ type: SessionDto })
    @ApiOperation({
        summary: 'Refresh session',
        description: 'Create new session based on `refreshToken`'
    })
    async refreshSession(
        @Body() body: RefreshSessionSchema
    ): Promise<SessionDto> {
        const oldSession = await this.sessionsService.verifyRefreshToken(body.refreshToken);

        const user = await this.sessionsService.getUserById(oldSession.data.userId);
        await this.sessionsService.destroySession(user.id);
        const session = await this.sessionsService.createSession(user.id, user.role);

        return new SessionDto(session);
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
