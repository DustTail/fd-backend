import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from '@node-redis/client';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

export interface RedisModuleOptions {
    inject: any[]
    logger?: any
    maxRetry: number
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
                    useFactory: async (configService: ConfigService) => {
                        let retryAttempts = 0;
                        let client: RedisClientType;

                        if (configService) {
                            client = createClient({
                                url: configService.get('REDIS_URL'),
                                name: configService.get('REDIS_NAME'),
                            });
                        } else {
                            client = createClient();
                        }

                        client.on('connect', () => {
                            redisLogger.log('The client is initiating a connection to the server.'),
                            retryAttempts = 0;
                        });
                        client.on('ready', () => redisLogger.log('The client successfully initiated the connection to the server.'));
                        client.on('end', () => redisLogger.warn('The client disconnected the connection to the server.'));
                        client.on('reconnecting', () => {
                            retryAttempts++;
                            redisLogger.warn(`The client is trying to reconnect to the server. Attempts: ${retryAttempts}`);
                            if (retryAttempts >= (options.maxRetry ?? 5)) {
                                client.quit();
                            }
                        });
                        client.on('error', (error) => redisLogger.error('Error: ', error));

                        await client.connect();
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
