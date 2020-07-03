import {
  Controller,
  UseGuards,
  Post,
  Logger,
  Body,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  MessagePattern,
  RpcException,
} from '@nestjs/microservices';
import {
  ApiOkResponse,
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Credentials } from './resources/credentials.dto';
import { TokenResponse } from './resources/token-response.dto';
import { CreateAuthSubject } from './resources/create-auth-subject.dto';
import { MongoAuthSubjectService } from './services/mongo-auth-subject.service';
import { PublicAuthSubject } from './resources/public-auth-subject.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly subjectService: MongoAuthSubjectService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('token')
  @ApiBody({ type: Credentials, required: true })
  @ApiOkResponse({
    type: TokenResponse,
    description: 'Successfully logged in: credentials are valid, returning an access token.',
  })
  @ApiOperation({
    operationId: 'login',
    description: 'This is the "login with username and password" route. Returns access token if credentials are valid.',
  })
  public async login(@Body() credentials: Credentials): Promise<TokenResponse> {
    Logger.verbose('[AuthController] login');
    try {
      const token = await this.authService.login(credentials);
      if (token && token !== '') {
        const res: TokenResponse = {
          accessToken: token,
        };
        return res;
      } else {
        return null;
      }
    } catch (err) {
      Logger.error(`Token creation failed with error: ${err}`);
      return null;
    }
  }

  @Post('')
  @ApiBody({ type: CreateAuthSubject, required: true })
  @ApiCreatedResponse({
    type: PublicAuthSubject,
    description: 'Successfully created new auth subject.',
  })
  @ApiOperation({
    operationId: 'create',
    description:
      'This should not be used. It is recommended to create a user in the user microservice, which causes an auth subject to be created',
  })
  public async createAuthSubject(
    @Body() subject: CreateAuthSubject
  ): Promise<PublicAuthSubject> {
    return await this.create(subject);
  }

  /** Messaging endpoint for other microservices to validate a token */
  @MessagePattern({ role: 'auth', cmd: 'check' })
  public async loggedIn(data: { jwt: string }) {
    try {
      const res = this.authService.validateToken(data.jwt);
      return res;
    } catch (err) {
      Logger.error(err);
      return false;
    }
  }

  /** Event handler for user created event. If a user is created, an auth subject is created automatically. */
  @MessagePattern('EVT_USER_CREATED')
  public async handleUserCreated(data: any): Promise<PublicAuthSubject> {
    Logger.verbose('Handling EVT_USER_CREATED event', 'AUTH_CONTROLLER');
    if (!data.username || !data.password) {
      Logger.error('Auth subject must supply username and password.');
      throw new RpcException('Auth subject must supply username and password');
    }
    const newSubject: CreateAuthSubject = {
      username: data.username,
      password: data.password,
      userId: data.id,
      email: data.email ?? '',
    };
    return await this.create(newSubject);
  }

  private async create(subject: CreateAuthSubject): Promise<PublicAuthSubject> {
    try {
      const sub = await this.subjectService.create(subject);
      Logger.verbose(`Created new Auth Subject with username: ${sub.username}`);
      return sub;
    } catch (err) {
      Logger.error(`Creation of new Auth Subject failed with error: ${err}`);
    }
  }
}
