import { Controller, UseGuards, Get, Post, Body } from '@nestjs/common';
import { MongoUserService } from './mongo-user.service';
import { MessagePattern } from '@nestjs/microservices';
import { User } from './resources/user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CreateUser } from './resources/create-user.dto';
import { ApiCreatedResponse, ApiBody } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: MongoUserService) {}

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
    return this.userService.create(user);
  }
}
