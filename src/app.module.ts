import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './routes/sessions/sessions.module';
import { RedisModule } from './services/redis/redis.module';

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
        RedisModule.forRootAsync({
            inject: [ConfigService],
            maxRetry: 5
        }),
        AuthModule,
        SessionsModule
    ],
})
export class AppModule {}
