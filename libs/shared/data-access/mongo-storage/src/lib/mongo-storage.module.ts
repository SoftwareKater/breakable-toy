import { Module, DynamicModule } from '@nestjs/common';
import { MongoFilterFactory } from './mongo-filter.factory';
import { mongoConnectionProvider } from './providers/database.providers';
import { mongoStorageServiceProvider } from './providers/service.providers';
import { MongoConnectionOptions } from './resources/mongo-connection-options.entity';
import { MongoConnectionOptionsProviderName } from './constants';

@Module({})
export class MongoStorageModule {
  static register(connectionOptions: MongoConnectionOptions): DynamicModule {
    return {
      module: MongoStorageModule,
      providers: [
        MongoFilterFactory,
        mongoStorageServiceProvider,
        mongoConnectionProvider,
        {
          provide: MongoConnectionOptionsProviderName,
          useValue: connectionOptions,
        },
      ],
      exports: [MongoFilterFactory, mongoStorageServiceProvider],
    };
  }
}
