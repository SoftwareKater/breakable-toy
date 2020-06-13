import { Module } from '@nestjs/common';
import { MongoFilterFactory } from './mongo-filter.factory';
import { mongoConnectionProvider } from './providers/database.providers';
import { mongoStorageServiceProvider } from './providers/service.providers';

@Module({
  controllers: [],
  providers: [MongoFilterFactory, mongoStorageServiceProvider, mongoConnectionProvider],
  exports: [MongoFilterFactory, mongoStorageServiceProvider],
})
export class MongoStorageModule {}
