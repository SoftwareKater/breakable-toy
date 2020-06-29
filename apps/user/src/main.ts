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

  // Microservice setup
  const messagingPort = configService.get('userService.tcp.port');
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: messagingPort,
    },
  });
  await app.startAllMicroservicesAsync();

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
  const port = configService.get('userService.api.port');

  await app.listen(port, () => {
    Logger.log('User Microservice listening at http://localhost:' + port + '/' + globalPrefix);
    Logger.log('User Microservice accepts messages at http://localhost:' + messagingPort)
  });
}

bootstrap();
