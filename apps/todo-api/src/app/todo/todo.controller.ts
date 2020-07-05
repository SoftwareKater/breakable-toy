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
  Headers,
  InternalServerErrorException,
} from '@nestjs/common';
import { MongoTodoService } from './mongo-todo.service';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiQuery,
  ApiOperation,
  ApiOAuth2,
} from '@nestjs/swagger';
import { Todo } from './resources/todo.dto';
import { CreateTodo } from './resources/create-todo';
import { TodoStatus } from './resources/todo-status.enum';
import { UpdateTodo } from './resources/update-todo';
import { TokenUtilsService, JwtAuthGuard } from '@breakable-toy/shared/util/auth-utils';

@ApiTags('todo')
@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: MongoTodoService,
    private readonly tokenUtilService: TokenUtilsService
  ) {}

  @Post('')
  @ApiOAuth2([])
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ operationId: 'create', description: 'Create a new todo.' })
  @ApiCreatedResponse({
    type: Todo,
    description: 'Successfully created the todo.',
  })
  public async create(@Body() todo: CreateTodo): Promise<Todo> {
    return new Promise(async (resolve, reject) => {
      try {
        const newTodo = await this.todoService.create(todo);
        resolve(newTodo);
      } catch (err) {
        Logger.error(err);
        reject(err);
      }
    });
  }

  @Delete('')
  @ApiOAuth2([])
  @UseGuards(JwtAuthGuard)
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
    @Query('status') status: TodoStatus,
    @Headers() headers: any
  ): Promise<boolean> {
    const userId = this.tokenUtilService.extractUserIdFromHeader(headers);
    return new Promise(async (resolve, reject) => {
      try {
        const deleteRes = await this.todoService.deleteByStatus(status);
        resolve(deleteRes);
      } catch (err) {
        Logger.error(err);
        reject(err);
      }
    });
  }

  @Get('all-users')
  @ApiOAuth2(['todo:read:all'])
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    operationId: 'getForAllUsers',
    description: 'Get all todos for all users.',
  })
  @ApiOkResponse({ isArray: true, type: Todo })
  public async getAll(): Promise<Todo[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const todos = await this.todoService.getAll();
        resolve(todos);
      } catch (err) {
        Logger.error(err);
        reject(err);
      }
    });
  }

  @Get('')
  @ApiOAuth2([])
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ operationId: 'getAll', description: 'Get all your todos.' })
  @ApiOkResponse({ isArray: true, type: Todo })
  public async getMy(@Headers() headers: any): Promise<Todo[]> {
    const userId = this.tokenUtilService.extractUserIdFromHeader(headers);

    return new Promise(async (resolve, reject) => {
      try {
        const todos = await this.todoService.getByUserId(userId);
        resolve(todos);
      } catch (err) {
        Logger.error(err);
        reject(err);
      }
    });
  }

  @Put(':id')
  @ApiOAuth2([])
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    operationId: 'update',
    description: 'Update one of your todos.',
  })
  @ApiOkResponse({ type: Todo })
  public async update(
    @Param('id') id: string,
    @Body() todo: UpdateTodo,
    @Headers() headers: any
  ): Promise<Todo> {
    const token = this.tokenUtilService.extractTokenFromHeader(headers);

    let originalCreator;
    try {
      originalCreator = (await this.todoService.getById(id)).userId;
    } catch {
      Logger.error('Cannot validate that the updater is the original creator.');
      throw new InternalServerErrorException();
    }
    if (!this.tokenUtilService.userIdsMatch(token, originalCreator)) {
      Logger.error('Only the original creator may update this todo.');
      throw new ForbiddenException();
    }

    Logger.verbose(`Updating Todo with id ${id}`);
    return new Promise(async (resolve, reject) => {
      try {
        const updatedTodo = await this.todoService.update(id, todo);
        resolve(updatedTodo);
      } catch (err) {
        Logger.error(err);
        reject(err);
      }
    });
  }
}
