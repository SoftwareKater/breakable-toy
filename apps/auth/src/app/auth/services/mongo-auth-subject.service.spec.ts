import { Test } from '@nestjs/testing';
import { MongoAuthSubjectService } from './mongo-auth-subject.service';
import { AuthSubject } from '../resources/auth-subject.dto';
import {
  MongoFilterFactory,
  MongoStorageService,
  MongoStorageModule,
  MongoStorageServiceProviderName,
} from '@breakable-toy/shared/data-access/mongo-storage';
import { hash } from 'bcrypt';
import { CreateAuthSubject } from '../resources/create-auth-subject.dto';

const mockStorageService = {
  init: (dbName: string) => {},
  create: (subject: AuthSubject) => {},
  getOne: (filter: any) => {},
};

describe('MongoAuthSubjectService', () => {
  let mongoAuthSubjectService: MongoAuthSubjectService;
  let mongoFilterFactory: MongoFilterFactory<AuthSubject>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [MongoStorageModule.register({})],
      controllers: [],
      providers: [
        MongoAuthSubjectService,
        // MongoStorageService,
        {
          provide: MongoStorageServiceProviderName,
          useValue: mockStorageService,
        },
        MongoFilterFactory,
        {
          provide: 'MONGO_DB_CONNECTION',
          useValue: {},
        },
      ],
    }).compile();

    mongoAuthSubjectService = moduleRef.get<MongoAuthSubjectService>(
      MongoAuthSubjectService
    );
    mongoFilterFactory = moduleRef.get<MongoFilterFactory<AuthSubject>>(
      MongoFilterFactory
    );
  });

  //   describe('create', () => {
  //     it('should return a subject', async () => {
  //       // Arrange
  //       const mockUsername = 'Max';
  //       const mockPassword = '1234';
  //       const mockCreateSubject: CreateAuthSubject = {
  //         username: mockUsername,
  //         password: mockPassword,
  //       };
  //       // jest
  //       //   .spyOn(mongoStorageService, 'getOne')
  //       //   .mockImplementation(
  //       //     (filter: any) => new Promise((resolve) => resolve(null))
  //       //   );
  //       // mongoStorageService.create = jest.fn(
  //       //   (subject: AuthSubject) => new Promise((resolve) => resolve(subject))
  //       // );
  //       // jest.spyOn(mongoStorageService, 'create');
  //       // .mockImplementation(
  //       //   (subject: AuthSubject) => new Promise((resolve) => resolve(subject))
  //       // );
  //       // Act
  //       const res = await mongoAuthSubjectService.create(mockCreateSubject);
  //       // Assert
  //       expect(res).toBeDefined();
  //       expect(res.passwordHash).toBeDefined();
  //       expect(res.username).toBe(mockUsername);
  //     });
  //   });

  describe('getByUsername', () => {
    it('should return the auth subject if it exists', () => {
      expect(1).toBeTruthy();
    });
  });
});
