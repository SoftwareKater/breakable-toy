import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import authConfig from '../../../../config/auth-microservice.config';
import userConfig from '../../../../config/user-microservice.config';
import todoAppConfig from '../../../../config/todo-app.config';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      load: [todoAppConfig, authConfig, userConfig],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
