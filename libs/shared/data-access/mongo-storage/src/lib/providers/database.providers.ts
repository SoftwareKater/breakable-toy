import { MongoDbConnectionProviderName } from '../constants';
import { createMongoConnection } from '../mongo-connection.service';

export const mongoConnectionProvider = {
  provide: MongoDbConnectionProviderName,
  useFactory: async () => {
    let port: number;
    if (process.env.MONGO_DB_PORT !== null) {
      port = parseInt(process.env.MONGO_DB_PORT, 10);
    }
    return await createMongoConnection({
      host: process.env.MONGO_DB_HOST || 'localhost',
      port: port || 27017,
      username: 'root',
      password: 'root',
      database: process.env.MONGO_DB_NAME || 'default',
    });
  },
};
