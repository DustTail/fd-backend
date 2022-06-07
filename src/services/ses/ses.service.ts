import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';

export interface EmailData {
    from?: string;
    to: string | string[];
    subject: string,
    html?: string,
    text?: string
}

@Injectable()
export class SesService {
    private readonly client: SESClient;
    constructor(
        private readonly configService: ConfigService,
        private readonly i18n: I18nService,
    ) {
        this.client = new SESClient({
            region: this.configService.get('SES_REGION'),
            credentials: {
                accessKeyId: this.configService.get('ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('SECRET_ACCESS_KEY')
            }
        });
    }

    async send(data: EmailData): Promise<void> {
        if (!data.html && !data.text) {
            throw new BadRequestException(this.i18n.t('aws.SES_MESSAGE_BODY_NOT_PROVIDED'));
        }

        const emailParams = {
            Source: data.from || this.configService.get('SES_FROM'),
            Destination: {
                ToAddresses: Array.isArray(data.to) ? data.to : [data.to]
            },
            Message: {
                Subject: {
                    Data: data.subject,
                    Charset: 'UTF-8'
                },
                Body: {}
            }
        };

        if (data.html) {
            emailParams.Message.Body['Html'] = {
                Data: data.html,
                Charset: 'UTF-8'
            };
        }

        if (data.text) {
            emailParams.Message.Body['Html'] = {
                Data: data.html,
                Charset: 'UTF-8'
            };
        }

        const command = new SendEmailCommand(emailParams);

        try {
            await this.client.send(command);
        } catch (error) {
            throw new ServiceUnavailableException(this.i18n.t('aws.SERVICE_UNAVAILABLE'));
        }
    }

    async sendWelcomeEmail(to: string, token: string): Promise<void> {
        const serverUrl = this.configService.get('SERVER_URL');
        const completeRegistrationLink = `${serverUrl}/api/verifications/email?token=${token}`;

        await this.send({
            to,
            subject: this.i18n.t('emails.WELCOME_SUBJECT'),
            html: this.i18n.t('emails.WELCOME_HTML', {
                args: { completeRegistrationLink }
            })
        });
    }
}
