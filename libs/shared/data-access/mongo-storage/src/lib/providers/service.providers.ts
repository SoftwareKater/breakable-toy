import { MongoStorageServiceProviderName, MongoConnectionProviderName } from '../constants';
import { MongoConnection } from '../mongo-connection.service';
import { MongoStorageService } from '../mongo-storage.service';


export const mongoStorageServiceProvider = {
    provide: MongoStorageServiceProviderName,
    useFactory: (connection: MongoConnection) => new MongoStorageService(connection),
    inject: [MongoConnectionProviderName],
  };