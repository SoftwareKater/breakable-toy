import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { MongoConnection } from './mongo-connection.service';
import {
  Collection,
  FilterQuery,
  FindAndModifyWriteOpResultObject,
} from 'mongodb';
import { MongoResource } from './resources/mongo-resource.entity';

@Injectable()
export class MongoStorageService<T extends MongoResource> {
  private collectionName: string;
  private get collection(): Collection<T> {
    return this.mongoConnection.getCollection(this.collectionName);
  }

  constructor(private readonly mongoConnection: MongoConnection) {}

  public init(collectionName: string) {
    this.collectionName = collectionName;
  }

  public async create(newEntity: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.collection.insertOne(newEntity, {}, (err, res) => {
        if (err || res.result.ok !== 1 || res.result.n !== 1) {
          Logger.error(
            `InsertOne failed with code ${err.code}: ${err.message}`
          );
          reject(err);
        } else {
          resolve(newEntity);
        }
      });
    });
  }
  
  public async deleteMany(filter: FilterQuery<T>): Promise<number> {
    return new Promise((resolve, reject) => {
      this.collection.deleteMany(filter, (err, res) => {
        if (err || res.result.ok !== 1) {
          Logger.error(
            `DeleteMany failed with code ${err.code}: ${err.message}`
          );
          reject(err);
        } else {
          resolve(res.deletedCount);
        }
      });
    });
  }

  public async deleteOne(filter: FilterQuery<T>): Promise<number> {
    return new Promise((resolve, reject) => {
      this.collection.deleteOne(filter, (err, res) => {
        if (err || res.result.ok !== 1) {
          Logger.error(
            `DeleteOne failed with code ${err.code}: ${err.message}`
          );
          reject(err);
        } else {
          if (res.deletedCount > 1) {
            Logger.warn(
              'Deleted more than one item, this should lead to an error...'
            );
          }
          resolve(res.deletedCount);
        }
      });
    });
  }

  public async getAll(): Promise<T[]> {
    return this.getMany({});
  }

  public async getCount(): Promise<number> {
    throw NotImplementedException;
  }

  public async getMany(filter: FilterQuery<T>): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const cursor = this.collection.find<T>(filter, {});
      // really everything is better than the following approach
      const resArray = cursor.toArray((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
      // const stream = cursor.stream();
      // stream.on('error', (err) => {
      //   reject(err);
      // });
      // stream.on('data', (chunk) => {
      //   Logger.verbose(chunk);
      // });
      // stream.on('end', () => {
      //   // done
      // });
      // const res: T[] = [];
      // cursor.forEach(
      //   (it) => {
      //     // console.log(it);
      //     if (it === null) {
      //     }
      //     res.push(it);
      //   },
      //   (end) => {
      //     reject(end);
      //   }
      // );
      // Logger.verbose(`Find found ${res.length} item(s)`);
      // resolve(res);
    });
  }

  public async getOne(filter: FilterQuery<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.collection.findOne<T>(filter, {}, (err, res) => {
        if (err) {
          Logger.error(`FindOne failed with code ${err.code}: ${err.message}`);
          reject(err);
        } else {
          Logger.verbose(`FindOne found obejct ${res}`);
          resolve(res);
        }
      });
    });
  }

  public async update(filter: FilterQuery<T>, updateEntity: any) {
    return new Promise((resolve, reject) => {
      this.collection.findOneAndReplace(
        filter,
        updateEntity,
        { returnOriginal: false },
        (err, res: FindAndModifyWriteOpResultObject<T>) => {
          if (err) {
            Logger.error(
              `FindOneAndReplace failed with code ${err.code}: ${err.message}`
            );
            reject(err);
          } else {
            resolve(res.value);
          }
        }
      );
    });
  }
}
