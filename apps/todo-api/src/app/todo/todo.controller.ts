import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import {
  ApiTags,
  ApiOkResponse,
  ApiParam,
  ApiCreatedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Todo } from './resources/todo.dto';
import { CreateTodo } from './resources/create-todo';
import { TodoStatus } from './resources/todo-status.enum';

@ApiTags('todo')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('')
  @ApiCreatedResponse({ type: Todo, description: 'Successfully created the todo' })
  public async create(@Body() todo: CreateTodo): Promise<Todo> {
    return await this.todoService.create(todo);
  }

  @Get('')
  @ApiOkResponse({ isArray: true, type: Todo })
  public async getAll(): Promise<Todo[]> {
    return await this.todoService.getAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Todo })
  public async getById(@Param('id') id: string): Promise<Todo> {
    return await this.todoService.getById(id);
  }

  @Put(':id')
  @ApiOkResponse({ type: Todo })
  public async update(
    @Param('id') id: string,
    @Body() todo: Todo
  ): Promise<Todo> {
    return await this.todoService.update(todo);
  }

  @Delete('')
  @ApiQuery({ name: 'status', enum: TodoStatus, example: TodoStatus.Done })
  @ApiOkResponse({ type: Boolean })
  public async deleteByFilter(
    @Query('status') status: TodoStatus
  ): Promise<boolean> {
    return await this.todoService.deleteByStatus(status);
  }
}
