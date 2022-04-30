import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { SessionsService } from 'src/routes/sessions/sessions.service';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly sessionService: SessionsService) {
        super();
    }

    async validate(token: string): Promise<Session> {
        if (!token) {
            throw new UnauthorizedException();
        }
        // TODO:
        return {
            userId: 1,
            sessionId: 'session-token',
            role: 1
        };
    }
}
