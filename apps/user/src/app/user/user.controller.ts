import { Controller } from '@nestjs/common';
import { MongoUserService } from './mongo-user.service';
import { MessagePattern } from '@nestjs/microservices';
import { User } from './resources/user.dto';

@Controller()
export class UserController {
  constructor(
    private readonly userService: MongoUserService
  ) { }

  @MessagePattern({ role: 'user', cmd: 'get' })
  public async get(data: any): Promise<User> {
    return this.userService.getByUsername(data.username);
  }
}
