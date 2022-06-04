import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { RedisService } from 'src/services/redis/redis.service';
import { AuthService } from './auth.service';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly redisService: RedisService,
        private readonly authService: AuthService
    ) {
        super();
    }

    async validate(token: string): Promise<PermissionsData> {
        if (!token) {
            throw new UnauthorizedException();
        }

        let session: any;

        try {
            const sessionData = this.authService.verifyToken(token);
            session = await this.redisService.getUserSession(sessionData.userId, sessionData.sessionToken);
        } catch (error) {
            throw new UnauthorizedException();
        }

        return session;
    }
}
