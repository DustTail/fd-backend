import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import models from './models';
import { HealthcheckModule } from './routes/healthcheck.ts/healthcheck.module';
import { UsersModule } from './routes/users/users.module';
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
                logging: (message) => sequelizeLogger.log(message),
                autoLoadModels: process.env.NODE_ENV === 'development'
            }),
        }),
        RedisModule.forRootAsync({
            inject: [ConfigService]
        }),
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: join(__dirname, '/i18n/'),
                watch: process.env.NODE_ENV !== 'production',
            },
        }),
        HealthcheckModule,
        AuthModule,
        UsersModule,
    ],
})
export class AppModule {}
