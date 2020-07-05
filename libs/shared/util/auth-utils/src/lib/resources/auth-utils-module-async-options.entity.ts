import { AuthUtilsModuleOptions } from './auth-utils-module-options.entity';

export interface AuthUtilsModuleAsyncOptions {
  useFactory?: (configService: any) => AuthUtilsModuleOptions;
  inject?: any[];
  useExisting?: any;
  useClass?: any;
}
