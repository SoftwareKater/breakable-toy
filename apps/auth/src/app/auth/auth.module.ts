import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { MongoStorageModule } from '@breakable-toy/shared/data-access/mongo-storage';
import { MongoAuthSubjectService } from './mongo-auth-subject.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongoStorageModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get('authService.jwtSecret');
        const jwtExpiration = configService.get('authService.jwtExpirationTimeInSec')
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: jwtExpiration + 's' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService,
    LocalStrategy,
    MongoAuthSubjectService,
    JwtStrategy,
  ],
  exports: [ConfigService],
})
export class AuthModule {}
