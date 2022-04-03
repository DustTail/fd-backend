import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter()
    );

    const configService = <ConfigService>app.get(ConfigService);
    const port = parseInt(configService.get('PORT')) ?? 4000;
    const payloadSize = configService.get('PAYLOAD_SIZE') ?? '10mb';

    app.use(bodyParser.json({ limit: payloadSize }));
    app.use(bodyParser.urlencoded({ extended: true, limit: payloadSize }));

    app.setGlobalPrefix('api');

    if (configService.get('NODE_ENV') !== 'production') {
        const swaggerConfig = new DocumentBuilder()
            .setTitle('fd')
            .setVersion('0.0.1')
            .build();

        const document = SwaggerModule.createDocument(app, swaggerConfig);
        SwaggerModule.setup('swagger', app, document);
    }

    await app.listen(port);
}
bootstrap();
