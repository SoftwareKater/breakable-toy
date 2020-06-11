import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongodb';

@Injectable()
export class MongoFilterFactory<MongoResource> {      /*T extends Resource*/
  public forgeIdFilter(targetId: string): any {    /*FilterQuery<MongoResource>*/        /*: FilterQuery<T>*/
    const filter = {
      id: { $eq: targetId },
    };
    return filter;
  }

  public forgeEqFilter<T>(prop: string, val: T) {
    const filter = {
      [prop]: { $eq: val }
    };
    return filter;
  }
}
