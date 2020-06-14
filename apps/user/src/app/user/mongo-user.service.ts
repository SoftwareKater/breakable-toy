import { Injectable, Inject } from '@nestjs/common';
import { MongoStorageService } from '@breakable-toy/shared/data-access/mongo-storage';
import { v4 as uuid } from 'uuid';
import { MongoFilterFactory } from '@breakable-toy/shared/data-access/mongo-storage';
import { MongoStorageServiceProviderName } from '@breakable-toy/shared/data-access/mongo-storage';
import { User } from './resources/user.dto';
import { CreateUser } from './resources/create-user.dto';

@Injectable()
export class MongoUserService {
  constructor(
    private readonly filterFactory: MongoFilterFactory<User>,
    @Inject(MongoStorageServiceProviderName)
    private storageService: MongoStorageService<User>
  ) {
    storageService.init('user');
  }

  public async create(user: CreateUser): Promise<User> {
    const newUser: User = {
      id: uuid(),
      username: user.username,
      password: user.password,
      alias: user.alias ?? '',
      email: user.email ?? '',
      createdAt: 0,
      name: user.name ?? '',
    };
    return this.storageService.create(newUser);
  }

  public async getById(id: string): Promise<User> {
    const filter = this.filterFactory.forgeIdFilter(id);
    return this.storageService.getOne(filter);
  }

  public async getByUsername(value: string): Promise<User> {
    const filter = this.filterFactory.forgeEqFilter('username', value);
    return this.storageService.getOne(filter);
  }

}