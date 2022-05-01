import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { I18nService } from 'nestjs-i18n';
import { userRoles } from 'src/resources/users';
import { RedisService } from 'src/services/redis/redis.service';

@Injectable()
export class SessionsService {
    constructor(
        private readonly configService: ConfigService,
        private readonly i18n: I18nService,
        private readonly redisService: RedisService
    ) { }

    async createSession(userId: number, role: userRoles): Promise<any> {
        const jwtKey = <string>this.configService.get('JWT_KEY');
        const jwtLifetime = <number>parseInt(this.configService.get('JWT_LIFETIME'));
        const jwtRefreshLifetime = <number>parseInt(this.configService.get('JWT_REFRESH_LIFETIME'));

        const tokenParams = {
            userId,
            role,
        };

        const accessToken = sign({ data: tokenParams }, jwtKey, { expiresIn: jwtLifetime });
        const refreshToken = sign({ data: tokenParams }, jwtKey, { expiresIn: jwtRefreshLifetime });

        await this.redisService.saveAccessToken(userId, jwtLifetime, accessToken);
        await this.redisService.saveRefreshToken(userId, jwtRefreshLifetime, refreshToken);

        return { accessToken, refreshToken };
    }

    async getSessionAccessToken(sessionToken: string): Promise<any> {
        let token;
        // TODO: find token

        if (!token) {
            throw new BadRequestException(
                await this.i18n.translate('tokens.TOKEN_INVALID')
            );
        }

        return token;
    }

    verifyToken(token: string): JwtPayload & any {
        const jwtKey = this.configService.get('JWT_KEY');

        return verify(token, jwtKey);
    }
}
