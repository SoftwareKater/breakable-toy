import { AuthUtilsModuleOptions } from './auth-utils-module-options.entity';

export interface AuthUtilsModuleOptionsFactory {
  createOptions: () => AuthUtilsModuleOptions;
}
