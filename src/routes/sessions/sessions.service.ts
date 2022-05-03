import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { I18nService } from 'nestjs-i18n';
import { ScopeOptions } from 'sequelize';
import { User } from 'src/models';
import { userRoles } from 'src/resources/users';
import { RedisService } from 'src/services/redis/redis.service';

@Injectable()
export class SessionsService {
    constructor(
        private readonly configService: ConfigService,
        private readonly i18n: I18nService,
        private readonly redisService: RedisService,
        @InjectModel(User)
        private readonly userModel: typeof User,
    ) { }

    async appendUserByGoogleId(userData: Record<string, unknown>): Promise<User> {
        const scopes: ScopeOptions[] = [
            { method: ['byGoogleId', userData.email] }
        ];

        let user = await this.userModel
            .scope(scopes)
            .findOne();

        if (!user) {
            user = await this.userModel.create(userData);
        }

        return user;
    }

    async getUserById(userId: number): Promise<User> {
        const user = await this.userModel.findByPk(userId);

        if (!user) {
            throw new NotFoundException(this.i18n.t('users.USER_NOT_FOUND'));
        }

        return user;
    }

    async createSession(userId: number, role: userRoles): Promise<Record<string, string|number>> {
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

        const session = {
            accessToken,
            refreshToken,
            accessTokenExpireAt: jwtLifetime,
            refreshTokenExpireAt: jwtRefreshLifetime
        };

        return session;
    }

    async destroySession(userId: number) {
        await this.redisService.deleteSessions(userId);
    }

    verifyToken(token: string): JwtPayload & any {
        const jwtKey = this.configService.get('JWT_KEY');

        return verify(token, jwtKey);
    }

    async verifyRefreshToken(token: string): Promise<JwtPayload & any> {
        const jwtKey = this.configService.get('JWT_KEY');
        let session;
        try{
            session = verify(token, jwtKey);
        } catch (error) {
            throw new UnprocessableEntityException(this.i18n.t('authorization.TOKEN_INVALID'));
        }

        const refreshToken = await this.redisService.getRefreshToken(session.data.userId);

        if (!refreshToken) {
            throw new UnprocessableEntityException(this.i18n.t('authorization.TOKEN_EXPIRED'));
        }

        if (token !== refreshToken) {
            throw new UnprocessableEntityException(this.i18n.t('authorization.TOKEN_NOT_EXIST'));
        }

        return session;
    }
}
