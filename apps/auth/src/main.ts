import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get<ConfigService>(ConfigService);
  // console.log(configService)
  const messagingPort = configService.get('authService.messagePort');
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: messagingPort,
    },
  });
  await app.startAllMicroservicesAsync();

  const port = configService.get('authService.apiPort');
  await app.listen(port, () => {
    Logger.log('Auth service listening at http://localhost:' + port);
    Logger.log('Auth service accepts messages at http://localhost:' + messagingPort)
  });
}

bootstrap();
