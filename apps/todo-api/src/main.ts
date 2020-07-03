/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  const configService = app.get<ConfigService>(ConfigService);

  // Start all microservices connections
  await app.startAllMicroservicesAsync();

  // Swagger
  const authMicroserviceHost = configService.get('authService.api.host');
  const authMicroservicePort = configService.get('authService.api.port');
  const options = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('An api for a simple todo application.')
    .setVersion('1.0')
    .addTag('todo')
    .addOAuth2({
      type: 'oauth2',
      flows: {
        implicit: {
          scopes: {},
          authorizationUrl: `http://${authMicroserviceHost}:${authMicroservicePort}/api/auth/token`,
        },
      },
    })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
