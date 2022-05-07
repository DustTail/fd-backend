import { Controller, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/guards';
import { UserSession } from 'src/common/decorators';
import { UserSessionDto } from 'src/dtos';
import { userRoles } from 'src/resources/users';
import { SessionsService } from '../sessions/sessions.service';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly sessionsService: SessionsService,
    ) {}

    @Put('role/author')
    @Auth({ role: userRoles.CLIENT })
    @ApiOkResponse({ type: UserSessionDto })
    @ApiOperation({
        summary: 'Change role to Author',
        description: 'Change role to Author and receive new session'
    })
    async becameAnAuthor(
        @UserSession() session: Session
    ): Promise<UserSessionDto> {
        const user = await this.usersService.getUserById(session.userId);

        await user.update({ role: userRoles.AUTHOR });
        await this.sessionsService.destroySession(session.userId);
        const newSession = await this.sessionsService.createSession(session.userId, userRoles.AUTHOR);

        return new UserSessionDto(user, newSession);
    }

}
