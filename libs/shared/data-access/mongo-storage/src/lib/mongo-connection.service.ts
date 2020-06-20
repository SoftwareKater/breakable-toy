import { MongoClient } from 'mongodb';
import { Logger, Injectable } from '@nestjs/common';
import { MongoConnectionOptions } from './resources/mongo-connection-options.entity';
import { MongoStorageLibraryName } from './constants';

@Injectable()
export class MongoConnection {
  private _isInitialized: boolean;
  private _client: MongoClient;
  private _dbName: string;

  public get client(): MongoClient {
    if (!this._isInitialized) {
      Logger.error(
        'Not initialized. Call init method and provide an MongoConnectionOptions object.'
      );
    }
    if (!this._client) {
      Logger.error('Not connected to mongo db.');
    }
    return this._client;
  }

  constructor() {}

  public disconnect(): void {
    this.client.close();
  }

  public getCollection(collectionName: string) {
    return this.client.db(this._dbName).collection(collectionName);
  }

  public async init(options: MongoConnectionOptions): Promise<void> {
    const connectionString = this.getConnectionStringFromOptionsOrEnv(options);
    const dbName = this.getDbNameFromOptionsOrEnc(options);
    Logger.log('Connecting to mongo db...', MongoStorageLibraryName);
    this._dbName = dbName;
    try {
      this._client = await this.connect(connectionString);
      Logger.log(
        `Successfully created connection to mongo db! Using database ${dbName}`,
        MongoStorageLibraryName
      );
    } catch {
      this._client = null;
      Logger.error(
        `Could not establish a connection to mongo db. Probably wrong connection string.`,
        MongoStorageLibraryName
      );
    }
    this._isInitialized = true;
  }

  private async connect(url: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      MongoClient.connect(
        url,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err, client: MongoClient) => {
          if (err) {
            reject(err);
          } else {
            resolve(client);
          }
        }
      );
    });
  }

  private getConnectionStringFromOptionsOrEnv(
    options: MongoConnectionOptions
  ): string {
    let connectionString: string;
    if (!options.host || !options.port) {
      connectionString =
        process.env.MONGO_STORAGE_LIB_CONNECTION_STRING ||
        'mongodb://localhost:27017';
    } else {
      if (options.username) {
        connectionString = `mongodb://${options.username}:${options.password}@${options.host}:${options.port}`;
      } else {
        connectionString = `mongodb://${options.host}:${options.port}`;
      }
    }
    return connectionString;
  }

  private getDbNameFromOptionsOrEnc(options: MongoConnectionOptions): string {
    let dbName: string;
    if (!options.database) {
      dbName = process.env.MONGO_STORAGE_LIB_DATABASE_NAME || 'default';
    } else {
      dbName = options.database;
    }
    return dbName;
  }
}
