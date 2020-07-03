import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const configService = app.get<ConfigService>(ConfigService);

  // Setup TCP messaging
  const tcpMessagingHost = configService.get('authService.tcp.host');
  const tcpMessagingPort = configService.get('authService.tcp.port');
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: tcpMessagingHost,
      port: tcpMessagingPort,
    },
  });
  Logger.log(
    `Accepting messages at http://${tcpMessagingHost}:` + tcpMessagingPort,
    'AUTH_SERVICE'
  );

  // Connect to message broker
  const url = configService.get<string>('authService.rmq.url');
  const queues = configService.get<string>('authService.rmq.queues').split(',');
  for (const queue of queues) {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue: queue,
        queueOptions: {
          durable: false,
        },
      },
    });
    Logger.log(`Listening to messages in the ${queue} queue`, 'AUTH_SERVICE');
  }

  // Start all microservices connections
  await app.startAllMicroservicesAsync();

  // Swagger
  const host = configService.get('authService.api.host');
  const port = configService.get('authService.api.port');
  const options = new DocumentBuilder()
    .setTitle('Auth Microservice')
    .setDescription('Authenticate users via api calls and messages.')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(globalPrefix, app, document);

  // Start Service
  await app.listen(port, () => {
    Logger.log(
      `Listening to api calls at http://${host}:${port}/${globalPrefix}`,
      'AUTH_SERVICE'
    );
  });
}

bootstrap();
