import {
  MongoConnectionProviderName,
  MongoConnectionOptionsProviderName,
} from '../constants';
import { MongoConnection } from '../mongo-connection.service';
import { MongoConnectionOptions } from '../resources/mongo-connection-options.entity';

export const mongoConnectionProvider = {
  provide: MongoConnectionProviderName,
  useFactory: async (options: MongoConnectionOptions) => {
    const connection = new MongoConnection();
    await connection.init(options);
    return connection;
  },
  inject: [MongoConnectionOptionsProviderName],
};
