import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
        const redisLoggerConnection = new Logger('Redis', { timestamp: true });
        const redisLoggerError = new Logger('Redis');

        return {
            module: RedisModule,
            providers: [
                {
                    provide: 'REDIS_CLIENT',
                    useFactory: async (configService: ConfigService) => {
                        let retryAttempts = 0;
                        const client = createClient({
                            url: configService.get('REDIS_URL'),
                            name: configService.get('REDIS_NAME'),
                        });

                        client.on('connect', () => {
                            redisLoggerConnection.log('The client is initiating a connection to the server.'),
                            retryAttempts = 0;
                        });
                        client.on('ready', () => redisLoggerConnection.log('The client successfully initiated the connection to the server.'));
                        client.on('end', () => redisLoggerConnection.warn('The client disconnected the connection to the server.'));
                        client.on('reconnecting', () => {
                            retryAttempts++;
                            redisLoggerConnection.warn(`The client is trying to reconnect to the server. Attempts: ${retryAttempts}`);
                            if (retryAttempts >= (options.maxRetry ?? 5)) {
                                client.quit();
                            }
                        });
                        client.on('error', (error) => redisLoggerError.error('Error: ', error));

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
