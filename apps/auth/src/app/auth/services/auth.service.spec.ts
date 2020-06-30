import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { MongoAuthSubjectService } from './mongo-auth-subject.service';
import { AuthSubject } from '../resources/auth-subject.dto';
import { Credentials } from '../resources/credentials.dto';
import {
  MongoFilterFactory,
  MongoStorageService,
  MongoStorageServiceProviderName,
} from '@breakable-toy/shared/data-access/mongo-storage';
import { hash } from 'bcrypt';

const mockStorageService = {
  init: (dbName: string) => {},
};

describe('AuthController', () => {
  let authService: AuthService;
  let mongoAuthSubjectService: MongoAuthSubjectService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [
        AuthService,
        MongoAuthSubjectService,
        JwtService,
        { provide: MongoFilterFactory, useValue: {} },
        {
          provide: MongoStorageServiceProviderName,
          useValue: mockStorageService,
        },
        { provide: 'JWT_MODULE_OPTIONS', useValue: {} },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    mongoAuthSubjectService = moduleRef.get<MongoAuthSubjectService>(
      MongoAuthSubjectService
    );
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return a token if provided with existing username and (any) password', async () => {
      // Arrange
      const mockUsername = 'Johnny';
      const mockCreds: Credentials = {
        username: mockUsername,
        password: '1234',
      };
      const mockSubject: AuthSubject = {
        id: '1',
        username: mockUsername,
      };
      const mockJwt = 'eyMockToken123';
      jest
        .spyOn(mongoAuthSubjectService, 'getByUsernameOmitPasswordHash')
        .mockReturnValue(new Promise((resolve) => resolve(mockSubject)));
      jest
        .spyOn(jwtService, 'signAsync')
        .mockReturnValue(new Promise((resolve) => resolve(mockJwt)));
      // Act
      const res = await authService.login(mockCreds);
      // Assert
      expect(res).toBeDefined();
      expect(res).toBe(mockJwt);
    });

    it('should return null if no user is found with that username', async () => {
      // Arrange
      const mockCreds: Credentials = {
        username: 'unknown user',
        password: 'blub',
      };
      jest
        .spyOn(mongoAuthSubjectService, 'getByUsernameOmitPasswordHash')
        .mockReturnValue(new Promise((resolve) => resolve(null)));
      // Act
      const res = await authService.login(mockCreds);
      // Assert
      expect(res).toBeNull();
    });
  });

  describe('validateCredentials', () => {
    it('should return the subject if provided with valid credentials', async () => {
      // Arrange
      const mockUsername = 'Johnny';
      const mockPassword = 'ainfDI$i3%jdGP';
      const mockCreds: Credentials = {
        username: mockUsername,
        password: mockPassword,
      };
      const hashedPassword = await hash(mockPassword, 10);
      const mockSubject: AuthSubject = {
        id: '1',
        username: mockUsername,
        passwordHash: hashedPassword,
      };
      jest
        .spyOn(mongoAuthSubjectService, 'getByUsername')
        .mockReturnValue(new Promise((resolve) => resolve(mockSubject)));
      // Act
      const res = await authService.validateCredentials(
        mockCreds.username,
        mockCreds.password
      );
      // Assert
      expect(res).toBeDefined();
      expect(res).toBe(mockSubject);
    });

    it('should return null if there is no user with that username', async () => {
        // Arrange
      const mockUsername = 'Johnny';
      const mockPassword = 'ainfDI$i3%jdGP';
      jest
        .spyOn(mongoAuthSubjectService, 'getByUsername')
        .mockReturnValue(new Promise((resolve) => resolve(null)));
      // Act
      const res = await authService.validateCredentials(
        mockUsername,
        mockPassword,
      );
      // Assert
      expect(res).toBeNull();
    });

    it('should return null if password does not match stored hash', async () => {
      // Arrange
      const mockUsername = 'Johnny';
      const mockPassword = 'ainfDI$i3%jdGP';
      const mockCreds: Credentials = {
        username: mockUsername,
        password: mockPassword,
      };
      const hashedPassword = await hash(mockPassword, 10);
      const mockSubject: AuthSubject = {
        id: '1',
        username: mockUsername,
        passwordHash: hashedPassword,
      };
      jest
        .spyOn(mongoAuthSubjectService, 'getByUsername')
        .mockReturnValue(new Promise((resolve) => resolve(mockSubject)));
      // Act
      const res = await authService.validateCredentials(
        mockCreds.username,
        'wrong password'
      );
      // Assert
      expect(res).toBeNull();
    });
  });
});
