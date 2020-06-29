import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Inject,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { MongoUserService } from './mongo-user.service';
import { MessagePattern, ClientProxy } from '@nestjs/microservices';
import { User } from './resources/user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CreateUser } from './resources/create-user.dto';
import { ApiCreatedResponse, ApiBody, ApiTags, ApiConflictResponse } from '@nestjs/swagger';

@ApiTags('user')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: MongoUserService,
    @Inject('USER_QUEUE') private readonly userQueue: ClientProxy
  ) {}

  @MessagePattern({ role: 'user', cmd: 'get' })
  public async get(data: any): Promise<User> {
    return this.userService.getByUsername(data.username);
  }

  @UseGuards(AuthGuard)
  @Get('check-auth')
  public async checkAuth(): Promise<string> {
    return 'You are authenticated and authorized';
  }

  @Post('')
  @ApiBody({ type: CreateUser })
  @ApiCreatedResponse({ type: User })
  @ApiConflictResponse({description: 'The username is already taken'})
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
    const result = await this.userQueue
      .send<any, CreateUser>('EVT_USER_CREATED', user)
      // .toPromise();
      // .then((res) => {
      .subscribe((res) => {
        Logger.verbose(`Consumer returned result:`);
        // maybe safe the auth subject id within the user.
        console.log(res);
      });

    return newUser;
  }
}
