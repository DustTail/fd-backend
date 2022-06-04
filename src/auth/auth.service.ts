import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { I18nService } from 'nestjs-i18n';
import { randomUUID } from 'node:crypto';
import { User } from 'src/models';
import { PasswordHelper } from 'src/utils/password.helper';

@Injectable()
export class AuthService {
    constructor(
        private readonly i18n: I18nService,
        private readonly configService: ConfigService,
        @InjectModel(User)
        private readonly userModel: typeof User
    ) { }

    async findUserByEmail(email: string): Promise<User> {
        const userBaseData = await this.userModel
            .scope([
                { method: ['byEmail', email] }
            ])
            .findOne();

        if (!userBaseData) {
            throw new NotFoundException(this.i18n.t('users.USER_NOT_FOUND'));
        }

        const user = await this.userModel.findByPk(userBaseData.id);

        return user;
    }

    async getUserById(userId: string): Promise<User> {
        const user = await this.userModel.findByPk(userId);

        if (!user) {
            throw new NotFoundException(this.i18n.t('users.USER_NOT_FOUND'));
        }

        return user;
    }

    collectPermissionsData(user: User): PermissionsData {
        return {
            userId: user.id,
            role: user.role,
        };
    }

    comparePasswords(userPassword: string, salt: string, providedPassword: string): void {
        if (!userPassword) {
            throw new BadRequestException(this.i18n.t('authorization.WRONG_CREDENTIALS'));
        }

        if (!PasswordHelper.compare(`${providedPassword}${salt}${process.env.SECRET_SALT}`, userPassword)) {
            throw new BadRequestException(this.i18n.t('authorization.WRONG_CREDENTIALS'));
        }
    }

    generateTokens(userId: string): SessionTokens  {
        const jwtKey = <string>this.configService.get('JWT_KEY');
        const jwtLifetime = <number>parseInt(this.configService.get('JWT_LIFETIME'));
        const jwtRefreshLifetime = <number>parseInt(this.configService.get('JWT_REFRESH_LIFETIME'));

        const sessionToken = randomUUID();

        const accessToken = sign({ sessionToken, userId }, jwtKey, { expiresIn: jwtLifetime });
        const refreshToken = sign({ sessionToken, createdAt: new Date() }, jwtKey, { expiresIn: jwtRefreshLifetime });

        return { sessionToken, accessToken, refreshToken };
    }

    verifyToken(token: string): JwtPayload {
        const jwtKey = this.configService.get('JWT_KEY');
        let data;

        try {
            data = verify(token, jwtKey);
        } catch (error) {
            throw new UnprocessableEntityException(this.i18n.t('authorization.TOKEN_INVALID'));
        }

        return data;
    }
}
