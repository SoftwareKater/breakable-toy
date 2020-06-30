import { Module } from '@nestjs/common';
import { MongoStorageModule } from '@breakable-toy/shared/data-access/mongo-storage';
import { TodoController } from './todo.controller';
import { MongoTodoService } from './mongo-todo.service';

@Module({
  imports: [
    MongoStorageModule.register({
      database: 'todo',
      host: 'localhost',
      port: 27017,
    }),
  ],
  controllers: [TodoController],
  providers: [MongoTodoService],
})
export class TodoModule {}
