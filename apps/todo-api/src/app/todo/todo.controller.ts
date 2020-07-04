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
  Req,
  Request,
  Headers,
  Session,
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
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { Todo } from './resources/todo.dto';
import { CreateTodo } from './resources/create-todo';
import { TodoStatus } from './resources/todo-status.enum';
import { UpdateTodo } from './resources/update-todo';
import { AuthGuard } from '../guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

@ApiTags('todo')
@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: MongoTodoService,
    private readonly jwtService: JwtService
  ) {}

  @Post('')
  @ApiOAuth2([])
  @UseGuards(AuthGuard)
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
    @Query('status') status: TodoStatus,
    @Headers() headers: any
  ): Promise<boolean> {
    const userId = this.getUserIdFromHeader(headers);
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
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'getAll', description: 'Get all your todos.' })
  @ApiOkResponse({ isArray: true, type: Todo })
  public async getMy(@Headers() headers: any): Promise<Todo[]> {
    const userId = this.getUserIdFromHeader(headers);

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
  @UseGuards(AuthGuard)
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
    const userIdFromToken = this.getUserIdFromHeader(headers);

    let originalCreator
    try {
      originalCreator = (await this.todoService.getById(id)).userId;
    } catch {
      throw new InternalServerErrorException();
    }
    if (!this.userIdsMatch(originalCreator, userIdFromToken)) {
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

  private userIdsMatch(userIdFromTodo, userIdFromToken): boolean {
    if (userIdFromTodo === userIdFromToken) {
      return true;
    }
    return false;
  }

  private extractTokenFromHeader(headers: any): string {
    return headers?.authorization?.split(' ')[1];
  }

  private getUserIdFromHeader(headers: any): string {
    const token = this.extractTokenFromHeader(headers);
    const userId = this.getUserIdFromToken(token);
    return userId;
  }

  private getUserIdFromToken(accessToken: string): string {
    const decodedToken: any = this.jwtService.decode(accessToken);
    const id = decodedToken.subject.userId;
    return id;
  }
}
