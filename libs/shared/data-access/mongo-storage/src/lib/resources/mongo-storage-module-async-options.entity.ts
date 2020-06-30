import { MongoConnectionOptions } from './mongo-connection-options.entity';

export interface MongoStorageModuleAsyncOptions extends MongoConnectionOptions {
  useFactory?: (configService: any) => MongoConnectionOptions;
  inject?: any[];
  imports?: any[];
  useExisting?: any;
  useClass?: any;
}
