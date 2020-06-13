import { Module } from '@nestjs/common';
import { MongoStorageModule } from '@breakable-toy/shared/data-access/mongo-storage';
import { TodoController } from './todo.controller';
import { MongoTodoService } from './mongo-todo.service';


@Module({
  imports: [MongoStorageModule],
  controllers: [TodoController],
  providers: [MongoTodoService],
})
export class TodoModule {}
