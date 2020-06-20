import { Module, DynamicModule, Provider } from '@nestjs/common';
import { MongoFilterFactory } from './mongo-filter.factory';
import { mongoConnectionProvider } from './providers/database.providers';
import { mongoStorageServiceProvider } from './providers/service.providers';
import {
  MongoConnectionOptionsProviderName,
} from './constants';
import { MongoStorageModuleAsyncOptions } from './resources/mongo-storage-module-async-options.entity';
import { MongoStorageModuleOptions } from './resources/mongo-storage-module-options.entity';
import { MongoStorageModuleOptionsFactory } from './resources/mongo-storage-module-options-factory.entity';

@Module({})
export class MongoStorageModule {
  static register(moduleOptions: MongoStorageModuleOptions): DynamicModule {
    return {
      module: MongoStorageModule,
      providers: [
        MongoFilterFactory,
        mongoStorageServiceProvider,
        mongoConnectionProvider,
        {
          provide: MongoConnectionOptionsProviderName,
          useValue: moduleOptions,
        },
      ],
      exports: [MongoFilterFactory, mongoStorageServiceProvider],
    };
  }

  static async registerAsync(
    moduleOptions: MongoStorageModuleAsyncOptions
  ): Promise<DynamicModule> {
    return {
      module: MongoStorageModule,
      imports: moduleOptions.imports || [],
      providers: [
        MongoFilterFactory,
        mongoStorageServiceProvider,
        mongoConnectionProvider,
        ...this.createAsyncProviders(moduleOptions),
      ],
      exports: [MongoFilterFactory, mongoStorageServiceProvider],
    };
  }

  private static createAsyncProviders(
    options: MongoStorageModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: MongoStorageModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: MongoConnectionOptionsProviderName,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: MongoConnectionOptionsProviderName,
      useFactory: async (optionsFactory: MongoStorageModuleOptionsFactory) =>
        await optionsFactory.createOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
