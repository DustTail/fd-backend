import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class GoogleService {
    public readonly client: OAuth2Client;

    constructor(
        private readonly configService: ConfigService,
        private readonly i18n: I18nService
    ) {
        const clientId = <string>this.configService.get('GOOGLE_CLIENT_ID');
        const clientSecret = <string>this.configService.get('GOOGLE_CLIENT_SECRET');

        this.client = new OAuth2Client(clientId, clientSecret);
    }

    async verifyToken(token: string): Promise<Partial<TokenPayload> & Record<string, unknown>> {
        let ticket: LoginTicket;

        try {
            ticket = await this.client.verifyIdToken({ idToken: token });
        } catch (error) {
            throw new BadRequestException(this.i18n.translate('google.TOKEN_INVALID'));
        }

        const payload = ticket.getPayload();

        return {
            email: payload.email,
            name: payload.name,
            picture: payload.picture
        };
    }
}
