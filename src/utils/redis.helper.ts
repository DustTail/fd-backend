export class RedisHelper {
    static getSessionTokenPrefix(userId: number, token: string): string {
        return `session[${userId}][${token}]`;
    }

    static getRefreshSessionTokenPrefix(token: string): string {
        return `refreshToken[${token}]`;
    }
}
