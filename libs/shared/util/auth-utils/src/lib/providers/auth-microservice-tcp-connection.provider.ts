import {
  AUTH_MICROSERVICE_TCP_CONNECTION_OPTIONS_PROVIDER_NAME,
  AUTH_MICROSERVICE_TCP_CONNECTION_PROVIDER_NAME,
} from '../constants';
import { AuthMicroserviceTcpConnectionOptions } from '../resources/auth-microservice-tcp-connection-options';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

export const AuthMicroserviceTcpConnectionProvider = {
  provide: AUTH_MICROSERVICE_TCP_CONNECTION_PROVIDER_NAME,
  useFactory: async (options: AuthMicroserviceTcpConnectionOptions) => {
    const host = options.tcpHost;
    const port = options.tcpPort;
    Logger.verbose(
      `Communicating with Auth Microservice via tcp messages to http://${host}:${port}`,
      'AUTH_UTILS_LIB'
    );
    return ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    });
  },
  inject: [AUTH_MICROSERVICE_TCP_CONNECTION_OPTIONS_PROVIDER_NAME],
};
