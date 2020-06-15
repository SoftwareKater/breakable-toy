import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  // Microservice setup
  const messagingPort = configService.get('userService.messagePort');
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: messagingPort,
    },
  });

  await app.startAllMicroservicesAsync();

  // Swagger
  const globalPrefix = 'api';
  const options = new DocumentBuilder()
    .setTitle('User Management Hybridservice')
    .setDescription('Manage users via api calls and messages.')
    .setVersion('1.0')
    .addTag('user')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(globalPrefix, app, document);

  // Start Service
  app.setGlobalPrefix(globalPrefix);
  const port = configService.get('userService.apiPort');

  await app.listen(port, () => {
    Logger.log('User Microservice listening at http://localhost:' + port + '/' + globalPrefix);
    Logger.log('User Microservice accepts messages at http://localhost:' + messagingPort)
  });
}

bootstrap();
