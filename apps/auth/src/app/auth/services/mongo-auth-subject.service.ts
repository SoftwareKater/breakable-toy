import { Injectable, Inject, Logger } from '@nestjs/common';
import { MongoStorageService } from '@breakable-toy/shared/data-access/mongo-storage';
import { v4 as uuid } from 'uuid';
import { MongoFilterFactory } from '@breakable-toy/shared/data-access/mongo-storage';
import { MongoStorageServiceProviderName } from '@breakable-toy/shared/data-access/mongo-storage';
import { hash } from 'bcrypt';
import { AuthSubject } from '../resources/auth-subject.dto';
import { CreateAuthSubject } from '../resources/create-auth-subject.dto';
import { PublicAuthSubject } from '../resources/public-auth-subject.dto';

@Injectable()
export class MongoAuthSubjectService {
  constructor(
    private readonly filterFactory: MongoFilterFactory<AuthSubject>,
    @Inject(MongoStorageServiceProviderName)
    private storageService: MongoStorageService<AuthSubject>
  ) {
    storageService.init('auth-subject');
  }

  /** Creates an auth subject (basically) from credentials. Hashes the password. */
  public async create(subject: CreateAuthSubject): Promise<AuthSubject> {
    const nameConflict = await this.getByUsername(subject.username);
    if (nameConflict) {
      throw Error(
        `Cannot create another auth subject with the name ${subject.username}`
      );
    }
    return new Promise(async (resolve, reject) => {
      hash(subject.password, 10, async (err, enc) => {
        if (err) {
          reject(err);
        } else {
          const newSubject: AuthSubject = {
            id: uuid(),
            username: subject.username,
            passwordHash: enc,
            name: subject.name ?? '',
            email: subject.email ?? '',
            accessToken: '',
            createdAt: new Date().getTime(),
          };
          const createdSubject = await this.storageService.create(newSubject);
          if (createdSubject) {
            delete createdSubject.passwordHash; // this should not leave the database
          } else {
            throw Error('Failed to create the new auth subject')
          }
          resolve(createdSubject);
        }
      });
    });
  }

  public async getById(id: string): Promise<AuthSubject> {
    const filter = this.filterFactory.forgeIdFilter(id);
    return await this.storageService.getOne(filter);
  }

  public async getByUsername(value: string): Promise<AuthSubject> {
    const filter = this.filterFactory.forgeEqFilter('username', value);
    return await this.storageService.getOne(filter);
  }

  public async getByUsernameOmitPasswordHash(value: string): Promise<PublicAuthSubject> {
    const filter = this.filterFactory.forgeEqFilter('username', value);
    const subject = await this.storageService.getOne(filter);
    if (subject) {
      delete subject.passwordHash;
    }
    return subject;
  }
}
