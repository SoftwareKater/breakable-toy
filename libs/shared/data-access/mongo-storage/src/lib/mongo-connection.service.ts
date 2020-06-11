import { MongoClient } from 'mongodb';
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class MongoConnection {
  private _client: MongoClient;
  private _dbName: string;

  public get client(): MongoClient {
    if (!this._client) {
      Logger.error('Not connected.');
    }
    return this._client;
  }

  constructor() {
    const connectionString = process.env.CONNECTION_STRING || 'mongodb://localhost:27017' || 'mongodb://mongo:27017' ;
    const dbName = process.env.DATABASE_NAME || 'default' 
    this.init(connectionString, dbName);
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

  public disconnect(): void {
    this.client.close();
  }

  public getCollection(name: string) {
    return this.client.db(this._dbName).collection(name);
  }

  public async init(connectionString: string, dbName: string) {
    Logger.log('Connecting to mongo db...');
    // console.log('<connection string>/<db name> : ', '' + connectionString + '/' + dbName);
    this._dbName = dbName;
    try {
      this._client = await this.connect(connectionString);
      Logger.log('Successfully created connection to mongo db!');
    } catch {
      this._client = null;
      Logger.error('Could not establish a connection to mongo db.');
    }
  }
}
