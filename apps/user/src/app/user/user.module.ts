import { Module } from '@nestjs/common';
import { MongoUserService } from './mongo-user.service';
import { UserController } from './user.controller';
import { MongoStorageModule } from '@breakable-toy/shared/data-access/mongo-storage';

@Module({
  imports: [MongoStorageModule],
  providers: [MongoUserService],
  controllers: [UserController],
})
export class UserModule {}
