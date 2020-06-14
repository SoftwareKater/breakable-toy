/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 4010,
    },
  });
  await app.startAllMicroservicesAsync();

  const port = process.env.PORT || 3020;
  await app.listen(3002);

  await app.listen(port, () => {
    Logger.log('User Microservice listening at http://localhost:' + port);
  });
}

bootstrap();
