import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export function getSequelizeConfiguration(configService: ConfigService): SequelizeModuleOptions {
    const databases = {
        development: configService.get('DB_SEQUELIZE_DEVELOPMENT_DATABASE'),
        test: configService.get('DB_SEQUELIZE_TEST_DATABASE'),
        PRODUCTION: configService.get('DB_SEQUELIZE_PRODUCTION_DATABASE'),
    };

    const database = databases[process.env.NODE_ENV] ?? databases.development;

    return {
        dialect: 'mysql',
        host: configService.get('DB_SEQUELIZE_HOST'),
        port: configService.get('DB_SEQUELIZE_PORT'),
        username: configService.get('DB_SEQUELIZE_USERNAME'),
        password: configService.get('DB_SEQUELIZE_PASSWORD'),
        database,
        dialectOptions: {
            connectTimeout: configService.get('DB_SEQUELIZE_CONNECTION_TIMEOUT') ?? 60000,
        },
    };
}
