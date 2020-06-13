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

  // const globalPrefix = 'api';
  // app.setGlobalPrefix(globalPrefix);
  // const port = process.env.PORT || 3333;
  // await app.listen(port, () => {
  //   Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  // });

  await app.startAllMicroservicesAsync();
  await app.listen(3001);
  Logger.log('Auth microservice running');
}

bootstrap();
