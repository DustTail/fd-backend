import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/guards';
import { UserSession } from 'src/common/decorators';
import { userRoles } from 'src/resources/users';
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
    @ApiCreatedResponse()
    @ApiOperation({
        summary: 'Create new session',
        description: `Create new session based on Google Identity Sign-In \`id_token\`.
        More info: https://developers.google.com/identity/sign-in/web/sign-in.`
    })
    async createSession(
        @Body() body: CreateSessionSchema,
    ): Promise<boolean> {
        const userData = await this.googleService.verifyToken(body.token);
        const user = await this.sessionsService.appendUserByGoogleId(userData);
        const tokens = await this.sessionsService.createSession(user.id, user.role);

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
