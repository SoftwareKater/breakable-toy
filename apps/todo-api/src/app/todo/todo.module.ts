import { Module } from '@nestjs/common';
import { MongoStorageModule } from '@breakable-toy/shared/data-access/mongo-storage';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [MongoStorageModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
