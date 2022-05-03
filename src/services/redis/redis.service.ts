import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from '@node-redis/client';

@Injectable()
export class RedisService {
    constructor(@Inject('REDIS_CLIENT') private readonly client: RedisClientType) { }

    async saveAccessToken(userId: number, lifeTime: number, token: string): Promise<void> {
        await this.client.SETEX(this.getUserAccessTokenPrefix(userId), lifeTime, token);
    }

    async saveRefreshToken(userId: number, lifeTime: number, token: string): Promise<void> {
        await this.client.SETEX(this.getUserRefreshTokenPrefix(userId), lifeTime, token);
    }

    async getAccessToken(userId: number) {
        return this.client.GET(this.getUserAccessTokenPrefix(userId));
    }

    async getRefreshToken(userId: number) {
        return this.client.GET(this.getUserRefreshTokenPrefix(userId));
    }

    async deleteSessions(userId: number) {
        await this.client.DEL(this.getUserAccessTokenPrefix(userId));
        await this.client.DEL(this.getUserAccessTokenPrefix(userId));
    }

    getUserRefreshTokenPrefix(userId: number): string {
        return `user[${userId}]_refresh_token`;
    }

    getUserAccessTokenPrefix(userId: number): string {
        return `user[${userId}]_access_token`;
    }
}
