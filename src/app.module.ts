import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { SessionsModule } from './routes/sessions/sessions.module';
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: join(__dirname, '/i18n/'),
                watch: process.env.NODE_ENV !== 'production',
            },
        }),
        SessionsModule
    ],
})
export class AppModule {}
