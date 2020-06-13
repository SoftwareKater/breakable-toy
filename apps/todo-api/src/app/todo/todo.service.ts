import { Injectable, Inject } from '@nestjs/common';
import { MongoStorageService } from '@breakable-toy/shared/data-access/mongo-storage';
import { v4 as uuid } from 'uuid';
import { MongoFilterFactory } from '@breakable-toy/shared/data-access/mongo-storage';
import { Todo } from './resources/todo.dto';
import { CreateTodo } from './resources/create-todo';
import { TodoPriority } from './resources/todo-priority.enum';
import { TodoStatus } from './resources/todo-status.enum';
import { UpdateTodo } from './resources/update-todo';
import { FilterQuery } from 'mongodb';
import { MongoStorageServiceProviderName } from '@breakable-toy/shared/data-access/mongo-storage';

@Injectable()
export class TodoService {
  constructor(
    private readonly filterFactory: MongoFilterFactory<Todo>,
    @Inject(MongoStorageServiceProviderName)
    private storageService: MongoStorageService<Todo>
  ) {
    storageService.init('todo');
  }

  public async create(todo: CreateTodo): Promise<Todo> {
    const newTodo: Todo = {
      id: uuid(),
      description: todo.description ?? '',
      priority: todo.priority ?? TodoPriority.Medium,
      status: todo.status ?? TodoStatus.Open,
      value: todo.value ?? 'New Todo',
    };
    return this.storageService.create(newTodo);
  }

  public async delete(id: string): Promise<boolean> {
    const filter = this.filterFactory.forgeIdFilter(id);
    return (await this.storageService.deleteOne(filter)) === 1;
  }

  public async deleteByStatus(status: TodoStatus): Promise<boolean> {
    const filter = this.filterFactory.forgeEqFilter<TodoStatus>('status', status);
    return (await this.storageService.deleteMany(filter)) > 0;
  }

  public async getAll(): Promise<Todo[]> {
    return this.storageService.getMany({});
  }

  public async getById(id: string): Promise<Todo> {
    const filter = this.filterFactory.forgeIdFilter(id);
    return this.storageService.getOne(filter);
  }

  public async update(todo: Todo): Promise<Todo> {
    // const existingTodo = await this.getById(todo.id);
    // const updatedTodo: Todo = {
    //   ...existingTodo,
    // };
    // const filter: FilterQuery<Todo> = this.filterFactory.forgeIdFilter(todo.id);
    // return this.storageService.update(filter, updatedTodo);
    return null;
  }
}
