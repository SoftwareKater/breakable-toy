import { MongoClient } from 'mongodb';
import { Logger, Injectable } from '@nestjs/common';
import { MongoConnectionOptions } from './resources/mongo-connection-options.entity';

/** Factory for the MongoConnection class */
export const createMongoConnection = async (
  options: MongoConnectionOptions
): Promise<MongoConnection> => {
  const connection = new MongoConnection();
  await connection.init(options);
  return connection;
};

@Injectable()
export class MongoConnection {
  private _client: MongoClient;
  private _dbName: string;

  public get client(): MongoClient {
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
    Logger.log('Connecting to mongo db...');
    // console.log('<connection string>/<db name> : ', '' + connectionString + '/' + dbName);
    this._dbName = dbName;
    try {
      this._client = await this.connect(connectionString);
      Logger.log(`Successfully created connection to mongo db! Using database ${dbName}`);
    } catch {
      this._client = null;
      Logger.error(
        `Could not establish a connection to mongo db`
      );
      Logger.verbose(
        `Used connection string: ${connectionString}`
      )
    }
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
    if (!options.host) {
      connectionString =
        process.env.CONNECTION_STRING || 'mongodb://localhost:27017';
    } else {
      connectionString = `mongodb://${options.host}:${options.port}`;
    }
    return connectionString;
  }

  private getDbNameFromOptionsOrEnc(options: MongoConnectionOptions): string {
    let dbName: string;
    if (!options.database) {
      dbName = process.env.DATABASE_NAME || 'default';
    } else {
      dbName = options.database;
    }
    return dbName;
  }
}
