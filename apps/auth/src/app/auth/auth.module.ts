import { Module, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserManagementMicroserviceName, JwtSecret } from '../constants';
import {
  Transport,
  ClientProxyFactory,
} from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.register({
      secret: JwtSecret, // naha, this should be env var
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: UserManagementMicroserviceName,
      useFactory: (configService: ConfigService) => {
        const port = configService.get('userService.messagePort');
        Logger.log('Communicating with User Management Hybridservice via messages to http://localhost:' + port);
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
})
export class AuthModule {}
