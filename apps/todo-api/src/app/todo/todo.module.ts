import { Module, Logger } from '@nestjs/common';
import { MongoStorageModule, MongoConnectionOptions } from '@breakable-toy/shared/data-access/mongo-storage';
import { TodoController } from './todo.controller';
import { MongoTodoService } from './mongo-todo.service';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import {JwtModule} from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}), // we do not want to sign or verify, but just decode tokens -> no secret needed
    MongoStorageModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const database = configService.get<string>('todoService.database.name');
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
  ],
  controllers: [TodoController],
  providers: [
    MongoTodoService,
    {
      provide: 'AUTH_CLIENT',
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('authService.tcp.host')
        const port = configService.get<number>('authService.tcp.port');
        Logger.log(
          `Communicating with Auth Microservice via tcp messages to http://${host}:${port}`
        );
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host,
            port,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class TodoModule {}
