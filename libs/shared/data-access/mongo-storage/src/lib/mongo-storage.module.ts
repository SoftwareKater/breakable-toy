import { Module } from '@nestjs/common';
import { MongoFilterFactory } from './mongo-filter.factory';
import { MongoConnection } from './mongo-connection.service';
import { MongoStorageService } from './mongo-storage.service';

@Module({
  controllers: [],
  providers: [MongoConnection, MongoFilterFactory, MongoStorageService],
  exports: [MongoConnection, MongoFilterFactory, MongoStorageService],
})
export class MongoStorageModule {}
