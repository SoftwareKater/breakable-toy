import { Injectable } from '@angular/core';
import {
  UserService as UserApiService,
  User,
  CreateUser,
} from '@breakable-toy/shared/data-access/user-api-client';

@Injectable()
export class UserService {
  constructor(private readonly userApiService: UserApiService) {}

  public async createUser(user: CreateUser): Promise<User> {
    const newUser = await this.userApiService
      .userControllerCreate(user)
      .toPromise();
    return newUser;
  }
}
