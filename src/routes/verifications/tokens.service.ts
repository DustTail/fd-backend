import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import { I18nService } from 'nestjs-i18n';
import { tokenTypes } from 'src/resources/tokens';

@Injectable()
export class TokensService {
    constructor(
        private readonly configService: ConfigService,
        private readonly i18n: I18nService,
    ) {}

    createEmailVerificationToken(userId: string): string {
        const jwtLifetime = <number>parseInt(this.configService.get('JWT_LIFETIME'));
        const jwtKey = <string>this.configService.get('JWT_KEY');

        const token = sign({ userId, type: tokenTypes.EmailVerification }, jwtKey, { expiresIn: jwtLifetime });

        return token;
    }

    getUserIdFromEmailVerificationToken(token: string): string {
        const jwtKey = this.configService.get('JWT_KEY');
        let data;

        try {
            data = verify(token, jwtKey);
        } catch (error) {
            throw new UnprocessableEntityException(this.i18n.t('tokens.TOKEN_INVALID'));
        }

        if (data.type !== tokenTypes.EmailVerification) {
            throw new BadRequestException(this.i18n.t('tokens.TOKEN_INVALID'));
        }

        return data.userId;
    }
}
