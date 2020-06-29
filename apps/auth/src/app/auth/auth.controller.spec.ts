import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { Credentials } from './resources/credentials.dto';
import { MongoAuthSubjectService } from './services/mongo-auth-subject.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: MongoAuthSubjectService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should return a token if provided with valid credentials', async () => {
      // Arrange
      const mockCreds: Credentials = { username: 'john doe', password: '1234' };
      const mockJwt = 'eyMockToken123';
      jest
        .spyOn(authService, 'login')
        .mockReturnValue(new Promise((resolve) => resolve(mockJwt)));
      // Act
      const res = await authController.login(mockCreds);
      // Assert
      expect(res).toBeDefined();
      expect(res.accessToken).toBe(mockJwt);
    });

    /** This will never happen, since the LocalAuthGuard will catch that case and return an Unauthorized Exception */
    it('should return null if no user is found with that username', async () => {
      // Arrange
      const mockCreds: Credentials = { username: 'unknown user', password: 'blub' };
      jest
        .spyOn(authService, 'login')
        .mockReturnValue(new Promise((resolve) => resolve(null)));
      // Act
      const res = await authController.login(mockCreds);
      // Assert
      expect(res).toBeNull();
    });
  });
});
