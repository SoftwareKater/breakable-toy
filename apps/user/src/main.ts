import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const configService = app.get<ConfigService>(ConfigService);

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('User Management Hybridservice')
    .setDescription('Manage users via api calls and messages.')
    .setVersion('1.0')
    .addTag('user')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(globalPrefix, app, document);

  // Start Service
  const host = configService.get('userService.api.host');
  const port = configService.get('userService.api.port');
  await app.listen(port, () => {
    Logger.log(`User Microservice listening at http://${host}:${port}/${globalPrefix}`);
  });
}

bootstrap();
