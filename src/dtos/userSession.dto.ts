import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/models';
import { SessionDto } from './session.dto';
import { UserDto } from './user.dto';

@Exclude()
export class UserSessionDto {
    @Expose()
    @ApiProperty({ type: () => UserDto })
        user: UserDto;

    @Expose()
    @ApiProperty({ type: () => SessionDto })
        session: SessionDto;

    constructor(user: User, session: Record<string, unknown>) {
        this.user = new UserDto(user);
        this.session = new SessionDto(session);
    }
}
