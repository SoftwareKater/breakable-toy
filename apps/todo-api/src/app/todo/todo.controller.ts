import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
  Logger,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { MongoTodoService } from './mongo-todo.service';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiQuery,
  ApiOperation,
  ApiOAuth2,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { Todo } from './resources/todo.dto';
import { CreateTodo } from './resources/create-todo';
import { TodoStatus } from './resources/todo-status.enum';
import { UpdateTodo } from './resources/update-todo';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('todo')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: MongoTodoService) {}

  @Post('')
  @ApiOAuth2([])
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'create', description: 'Create a new todo.' })
  @ApiCreatedResponse({
    type: Todo,
    description: 'Successfully created the todo.',
  })
  public async create(@Body() todo: CreateTodo): Promise<Todo> {
    return await this.todoService.create(todo);
  }

  @Delete('')
  @ApiOAuth2([])
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'deleteByFilter',
    description: 'Delete todos by a filter.',
  })
  @ApiQuery({ name: 'status', enum: TodoStatus, example: TodoStatus.Done })
  @ApiOkResponse({
    type: Boolean,
    description: 'Successfully deleted the todos matching the filter.',
  })
  public async deleteByFilter(
    @Query('status') status: TodoStatus
  ): Promise<boolean> {
    if (!this.userIdsMatch('', '')) {
      throw new ForbiddenException;
    }
    return await this.todoService.deleteByStatus(status);
  }

  @Get('all-users')
  @ApiOAuth2(['todo:read:all'])
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'getForAllUsers', description: 'Get all todos for all users.' })
  @ApiOkResponse({ isArray: true, type: Todo })
  public async getAll(): Promise<Todo[]> {
    return await this.todoService.getAll();
  }

  @Get('')
  @ApiOAuth2([])
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'getAll', description: 'Get all your todos.' })
  @ApiOkResponse({ isArray: true, type: Todo })
  public async getMy(): Promise<Todo[]> {
    if (!this.userIdsMatch('', '')) {
      throw new ForbiddenException;
    }
    return await this.todoService.getAll();
  }

  @Put(':id')
  @ApiOAuth2([])
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'update', description: 'Update one of your todos.' })
  @ApiOkResponse({ type: Todo })
  public async update(
    @Param('id') id: string,
    @Body() todo: UpdateTodo
  ): Promise<Todo> {
    if (!this.userIdsMatch('', '')) {
      throw new ForbiddenException;
    }
    return await this.todoService.update(id, todo);
  }

  private userIdsMatch(userIdFromTodo, userIdFromToken): boolean {
    if (userIdFromTodo === userIdFromToken) {
      return true;
    } 
    return false;
  }
}
