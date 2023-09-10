import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Inject,
  Logger,
  ConflictException,
  Param,
  Headers,
} from '@nestjs/common';
import { MongoUserService } from './mongo-user.service';
import { MessagePattern, ClientProxy } from '@nestjs/microservices';
import { User } from './resources/user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CreateUser } from './resources/create-user.dto';
import {
  ApiCreatedResponse,
  ApiBody,
  ApiTags,
  ApiConflictResponse,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

@ApiTags('user')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: MongoUserService,
    @Inject('USER_QUEUE') private readonly userQueue: ClientProxy,
    private readonly jwtService: JwtService
  ) {}

  @Post('')
  @ApiBody({ type: CreateUser })
  @ApiCreatedResponse({ type: User })
  @ApiConflictResponse({ description: 'The username is already taken' })
  @ApiOperation({ operationId: 'create', description: 'Create a new user' })
  public async create(@Body() user: CreateUser): Promise<User> {
    Logger.verbose(`Creating new user with username: ${user.username}`);
    let newUser: User;
    try {
      newUser = await this.userService.create(user);
    } catch (err) {
      // Discriminate between name conflict and storage error
      throw new ConflictException(
        `The username ${user.username} is already taken.`
      );
    }

    Logger.verbose(`Emitting EVT_USER_CREATED event.`);
    const result = this.userQueue
      .send<any, CreateUser>('EVT_USER_CREATED', {
        ...newUser,
        password: user.password,
      })
      .toPromise()
      .then((res) => {
        Logger.verbose(
          `Auth microservice created an auth subject for user "${res.username}".`
        );
        Logger.debug(res);
      })
      .catch(async (err) => {
        Logger.error(err.message);
        Logger.verbose('Reverting user creation.');
        await this.userService.delete(newUser.id);
      });

    return newUser;
  }

  @Get(':id')
  @ApiOkResponse({ type: User })
  @ApiOperation({ operationId: 'getById', description: 'Get a user by its id' })
  public async getById(@Param('id') id: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.userService.getById(id);
        resolve(user);
      } catch (err) {
        Logger.error(err);
        reject(err);
      }
    });
  }

  @Get('me')
  @ApiOkResponse({ type: User })
  @ApiOperation({ operationId: 'getMe', description: 'Get the user corresponding to the userId in the access token' })
  public async getMe(@Headers() headers: any): Promise<User> {
    const id = '';
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.userService.getById(id);
        resolve(user);
      } catch (err) {
        Logger.error(err);
        reject(err);
      }
    });
  }
}
