import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

import { UserModule } from './user/user.module';
import userConfig from '../../../config/user-microservice.config';
import authConfig from '../../../config/auth-microservice.config';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      load: [authConfig, userConfig],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
