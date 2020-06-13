import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserManagementMicroserviceName, JwtSecret } from '../constants';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: UserManagementMicroserviceName,
        transport: Transport.TCP,
        options: {
          // copied from main.ts -> use configModule
          host: 'localhost',
          port: 4010,
        },
      },
    ]),
    JwtModule.register({
      secret: JwtSecret,  // naha, this should be env var
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
