import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Inject,
  Logger,
} from '@nestjs/common';
import { MongoUserService } from './mongo-user.service';
import { MessagePattern, ClientProxy } from '@nestjs/microservices';
import { User } from './resources/user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CreateUser } from './resources/create-user.dto';
import { ApiCreatedResponse, ApiBody } from '@nestjs/swagger';

@Controller('user')
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
  public async create(@Body() user: CreateUser): Promise<User> {
    Logger.verbose(`Creating new user with username: ${user.username}`);
    const newUser = await this.userService.create(user);

    Logger.verbose(`Emitting EVT_USER_CREATED event.`);
    // maybe safe the auth subject id within the user.
    const result = await this.userQueue
      .send<any, CreateUser>('EVT_USER_CREATED', user)
      // .toPromise();
      // .then((res) => {
      .subscribe((res) => {
        Logger.verbose(`Consumer returned result:`);
        console.log(res);
      });
    return newUser;
  }
}
