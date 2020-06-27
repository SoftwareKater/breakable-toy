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
import { MongoConnectionOptions } from '@breakable-toy/shared/data-access/mongo-storage';

@Module({
  imports: [
    MongoStorageModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const database = configService.get<string>('authService.database.name');
        const host = configService.get<string>('authService.database.host');
        const port = configService.get<number>('authService.database.port');
        const options: MongoConnectionOptions = {
          database,
          host,
          port,
        };
        return options;
      },
      inject: [ConfigService],
    }),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get('authService.jwt.secret');
        const jwtExpiration = configService.get(
          'authService.jwt.expirationTimeInSec'
        );
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
