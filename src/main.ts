import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UpdateSessionCookieInterceptor } from './common/interceptors';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            bodyLimit: 10000000, // 10mb;
        })
    );

    const configService = <ConfigService>app.get(ConfigService);
    const port = parseInt(configService.get('PORT')) ?? 4000;

    app.setGlobalPrefix('api');

    app.useGlobalInterceptors(new UpdateSessionCookieInterceptor());

    if (configService.get('NODE_ENV') !== 'production') {
        const swaggerConfig = new DocumentBuilder()
            .addBearerAuth()
            .setTitle('fd')
            .setVersion('0.0.1')
            .build();

        const document = SwaggerModule.createDocument(app, swaggerConfig);
        SwaggerModule.setup('swagger', app, document);
    }

    await app.listen(port);
}
bootstrap();
