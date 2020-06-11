import { ObjectId } from 'mongodb';

export interface MongoResource {
    _id?: ObjectId;
    id: string;
}