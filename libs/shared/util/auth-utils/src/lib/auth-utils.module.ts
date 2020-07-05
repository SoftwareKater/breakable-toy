import { Module, DynamicModule, Provider } from '@nestjs/common';
import { AuthUtilsModuleOptions } from './resources/auth-utils-module-options.entity';
import { TokenUtilsService } from './services/token-utils.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthUtilsModuleAsyncOptions } from './resources/auth-utils-module-async-options.entity';
import { AUTH_MICROSERVICE_TCP_CONNECTION_OPTIONS_PROVIDER_NAME } from './constants';
import { AuthUtilsModuleOptionsFactory } from './resources/auth-utils-module-options-factory.entity';
import { AuthMicroserviceTcpConnectionProvider } from './providers/auth-microservice-tcp-connection.provider';
import { ConfigService } from '@nestjs/config';

const PROVIDERS = [TokenUtilsService, AuthMicroserviceTcpConnectionProvider];
const EXPORTS = [TokenUtilsService, AuthMicroserviceTcpConnectionProvider];

@Module({})
export class AuthUtilsModule {
  static register(moduleOptions: AuthUtilsModuleOptions): DynamicModule {
    return {
      module: AuthUtilsModule,
      imports: [
        JwtModule.register({
          secret: moduleOptions.jwtSecret,
          signOptions: { expiresIn: moduleOptions.jwtExpiration + 's' },
        }),
      ],
      providers: [
        ...PROVIDERS,
        {
          provide: AUTH_MICROSERVICE_TCP_CONNECTION_OPTIONS_PROVIDER_NAME,
          useValue: {
            tcpHost: moduleOptions.tcpHost,
            tcpPort: moduleOptions.tcpPort,
          },
        },
      ],
      exports: [...EXPORTS],
    };
  }

  static async registerAsync(
    moduleAsyncOptions: AuthUtilsModuleAsyncOptions
  ): Promise<DynamicModule> {
    return {
      module: AuthUtilsModule,
      imports: [
        JwtModule.registerAsync({
          useFactory: (configService: ConfigService) => {
            const jwtSecret = configService.get('authService.jwt.secret');
            const jwtExpiration = configService.get(
              'authService.jwt.expirationTimeInSec'
            );
            return {
              secret: jwtSecret,
              signOptions: { expiresIn: jwtExpiration + 's' },
            };
          },
          inject: [ConfigService],
        }),
      ],
      providers: [
        ...PROVIDERS,
        ...this.createAsyncProviders(moduleAsyncOptions),
      ],
      exports: [...EXPORTS],
    };
  }

  private static createAsyncProviders(
    options: AuthUtilsModuleAsyncOptions
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
    options: AuthUtilsModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: AUTH_MICROSERVICE_TCP_CONNECTION_OPTIONS_PROVIDER_NAME,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: AUTH_MICROSERVICE_TCP_CONNECTION_OPTIONS_PROVIDER_NAME,
      useFactory: async (optionsFactory: AuthUtilsModuleOptionsFactory) =>
        await optionsFactory.createOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
