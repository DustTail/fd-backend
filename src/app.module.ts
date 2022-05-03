import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import models from './models';
import { SessionsModule } from './routes/sessions/sessions.module';
import { RedisModule } from './services/redis/redis.module';
import { getSequelizeConfiguration } from './utils/sequelize.config';

const sequelizeLogger = new Logger('Sequelize');
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        SequelizeModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config) => ({
                ...getSequelizeConfiguration(config),
                models,
                logging: (message) => sequelizeLogger.log(message)
            }),
        }),
        RedisModule.forRootAsync({
            inject: [ConfigService],
            maxRetry: 5
        }),
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: join(__dirname, '/i18n/'),
                watch: process.env.NODE_ENV !== 'production',
            },
        }),
        AuthModule,
        SessionsModule
    ],
})
export class AppModule {}
