import { MongoConnectionOptions } from './mongo-connection-options.entity';
import { DynamicModule, Type, ForwardReference } from '@nestjs/common';

export interface MongoStorageModuleAsyncOptions extends MongoConnectionOptions {
  useFactory?: (configService: any) => MongoConnectionOptions;
  inject?: any[];
  imports?: (
    | DynamicModule
    | Type<any>
    | Promise<DynamicModule>
    | ForwardReference<any>
  )[];
  useExisting?: any;
  useClass?: any;
}
