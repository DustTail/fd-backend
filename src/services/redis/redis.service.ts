import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from 'redis';
import { translates } from 'src/translates';
import { RedisHelper } from 'src/utils/redis.helper';
@Injectable()
export class RedisService {
    constructor(
        private readonly configService: ConfigService,
        @Inject('REDIS_CLIENT') private readonly client: RedisClientType
    ) { }

    async saveSession(userId: number, data: PermissionsData, tokens: SessionTokens): Promise<[void, void]> {
        return Promise.all([
            this.saveSessionToken(tokens.sessionToken, userId, data),
            this.saveRefreshToken(tokens.refreshToken, userId, tokens.sessionToken)
        ]);
    }

    private async saveSessionToken(token: string, userId: number, data: Record<string, any>): Promise<void> {
        const jwtLifetime = <number>parseInt(this.configService.get('JWT_LIFETIME'));
        await this.client.SETEX(RedisHelper.getSessionTokenPrefix(userId, token), jwtLifetime, JSON.stringify(data));
    }

    private async saveRefreshToken(token: string, userId: number, sessionToken: string): Promise<void> {
        const jwtRefreshLifetime = <number>parseInt(this.configService.get('JWT_REFRESH_LIFETIME'));
        await this.client.SETEX(RedisHelper.getRefreshSessionTokenPrefix(token), jwtRefreshLifetime, JSON.stringify({ userId, sessionToken }));
    }

    async getUserSession(userId, accessToken: string): Promise<PermissionsData> {
        const sessionData = await this.client.GET(RedisHelper.getSessionTokenPrefix(userId, accessToken));

        if (!sessionData) {
            throw new NotFoundException(translates.TOKEN_EXPIRED);
        }

        return JSON.parse(sessionData);
    }

    async getUserId(refreshToken: string): Promise<number> {
        const sessionData = await this.client.GET(RedisHelper.getRefreshSessionTokenPrefix(refreshToken));

        if (!sessionData) {
            throw new NotFoundException(translates.TOKEN_EXPIRED);
        }

        const { userId } = JSON.parse(sessionData);

        return userId;
    }

    async destroySessionToken(refreshToken: string): Promise<void> {
        const sessionData = await this.client.GET(RedisHelper.getRefreshSessionTokenPrefix(refreshToken));

        if (sessionData) {
            const { sessionToken, userId } = JSON.parse(sessionData);
            await this.client.DEL(RedisHelper.getSessionTokenPrefix(userId, sessionToken));
        }

        await this.client.DEL(RedisHelper.getRefreshSessionTokenPrefix(refreshToken));
    }
}
