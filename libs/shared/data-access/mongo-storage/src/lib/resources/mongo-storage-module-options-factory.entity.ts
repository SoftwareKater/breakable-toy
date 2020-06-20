import { MongoStorageModuleOptions } from './mongo-storage-module-options.entity';

export interface MongoStorageModuleOptionsFactory {
  createOptions: () => MongoStorageModuleOptions;
}
