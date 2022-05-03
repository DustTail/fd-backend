import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { I18nService } from 'nestjs-i18n';
import { Strategy } from 'passport-http-bearer';
import { SessionsService } from 'src/routes/sessions/sessions.service';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly i18n: I18nService,
        private readonly sessionService: SessionsService
    ) {
        super();
    }

    async validate(token: string): Promise<Session> {
        if (!token) {
            throw new UnauthorizedException();
        }

        let session: JwtPayload;
        try {
            session = this.sessionService.verifyToken(token);
        } catch (error) {
            throw new UnauthorizedException(this.i18n.translate('authorization.TOKEN_INVALID'));
        }

        const accessToken = await this.sessionService.getSessionAccessToken(session.data.userId);

        if (!accessToken) {
            throw new UnauthorizedException(this.i18n.translate('authorization.TOKEN_EXPIRED'));
        }

        if (token !== accessToken) {
            throw new UnauthorizedException(this.i18n.translate('authorization.TOKEN_NOT_EXIST'));
        }

        return session.data;
    }
}
