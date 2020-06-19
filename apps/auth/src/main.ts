import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  const configService = app.get<ConfigService>(ConfigService);
  
  // Microservice setup
  const messagingPort = configService.get('authService.messagePort');
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
    .setTitle('Auth Microservice')
    .setDescription('Authenticate users via api calls and messages.')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(globalPrefix, app, document);

  // Start Service
  const port = configService.get('authService.apiPort');
  await app.listen(port, () => {
    Logger.log('Auth service listening at http://localhost:' + port + '/' + globalPrefix);
    Logger.log('Auth service accepts messages at http://localhost:' + messagingPort)
  });
}

bootstrap();
