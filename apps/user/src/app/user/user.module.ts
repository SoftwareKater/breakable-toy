import { Module, Logger } from '@nestjs/common';
import { MongoUserService } from './mongo-user.service';
import { UserController } from './user.controller';
import { MongoStorageModule } from '@breakable-toy/shared/data-access/mongo-storage';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    MongoStorageModule.register({
      database: 'user',
      host: 'localhost',
      port: 27017,
    }),
  ],
  providers: [
    MongoUserService,
    {
      provide: 'AUTH_CLIENT',
      useFactory: (configService: ConfigService) => {
        const port = configService.get('authService.messagePort');
        Logger.log(
          'Communicating with Auth Hybridservice via messages to http://localhost:' +
            port
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
