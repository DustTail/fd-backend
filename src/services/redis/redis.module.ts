import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { RedisService } from './redis.service';

interface RedisModuleOptions {
    inject: any[]
}

@Global()
@Module({})
export class RedisModule {
    static forRootAsync(options: RedisModuleOptions) {
        const redisLogger = new Logger('Redis');

        return {
            module: RedisModule,
            providers: [
                {
                    provide: 'REDIS_CLIENT',
                    useFactory: async (configService: ConfigService): Promise<RedisClientType> => {
                        let client: RedisClientType;

                        if (configService) {
                            client = createClient(configService.get('REDIS_URL'));
                        } else {
                            client = createClient();
                        }

                        try {
                            await client.connect();
                        } catch (error) {
                            redisLogger.error(error);
                        }

                        return client;
                    },
                    inject: options.inject ?? []
                },
                RedisService
            ],
            exports: [RedisService],
        };
    }
}
