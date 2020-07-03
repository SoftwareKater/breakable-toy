import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from '../../../../config/auth-microservice.config';
import userConfig from '../../../../config/user-microservice.config';
import todoConfig from '../../../../config/todo-api.config';

@Module({
  imports: [
    TodoModule,
    ConfigModule.forRoot({
      load: [todoConfig, authConfig, userConfig],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
