import { Module, Logger } from '@nestjs/common';
import { MongoUserService } from './mongo-user.service';
import { UserController } from './user.controller';
import { MongoStorageModule, MongoConnectionOptions } from '@breakable-toy/shared/data-access/mongo-storage';
import {
  ClientProxyFactory,
  Transport,
  ClientsModule,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}), // we only want to decode tokens -> no secret needed
    MongoStorageModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const database = configService.get<string>('userService.database.name');
        const host = configService.get<string>('todoApp.database.host');
        const port = configService.get<number>('todoApp.database.port');
        const options: MongoConnectionOptions = {
          database,
          host,
          port,
        };
        return options;
      },
      inject: [ConfigService],
    }),
    ClientsModule.register([
      {
        name: 'USER_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'user',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [
    MongoUserService,
    {
      provide: 'AUTH_CLIENT',
      useFactory: (configService: ConfigService) => {
        const port = configService.get('authService.tcp.port');
        Logger.log(
          `Communicating with Auth Microservice via tcp messages to http://localhost:${port}`
        );
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            port,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
