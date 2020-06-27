import {
  Controller,
  UseGuards,
  Post,
  Logger,
  Body,
  Get,
  Param,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
  EventPattern,
  RpcException,
} from '@nestjs/microservices';
import {
  ApiOkResponse,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOAuth2,
} from '@nestjs/swagger';
import { Credentials } from './resources/credentials.dto';
import { TokenResponse } from './resources/token-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateAuthSubject } from './resources/create-auth-subject.dto';
import { MongoAuthSubjectService } from './mongo-auth-subject.service';
import { PublicAuthSubject } from './resources/public-auth-subject.dto';
import { AuthSubject } from './resources/auth-subject.dto';

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
    description:
      'Returns access token if credentials are valid. This is the login with username + password route.',
  })
  public async login(@Body() credentials: Credentials): Promise<TokenResponse> {
    Logger.verbose('[AuthController] login');
    try {
      return await this.authService.login(credentials);
    } catch (err) {
      Logger.error(`Token creation failed with error: ${err}`);
    }
  }

  @Post('')
  @ApiBody({ type: CreateAuthSubject, required: true })
  @ApiCreatedResponse({
    type: PublicAuthSubject,
    description: 'Successfully created new auth subject.',
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

  @MessagePattern('EVT_USER_CREATED')
  public async handleUserCreated(data: any): Promise<PublicAuthSubject> {
    Logger.verbose('Handling EVT_USER_CREATED event', 'AUTH_CONTROLLER')
    if (!data.username || !data.password) {
      Logger.error('Auth subject must supply username and password.');
      throw new RpcException('Auth subject must supply username and password');
    } 
    const newSubject: CreateAuthSubject = {
      username: data.username,
      password: data.password,
      email: data.email ?? '',
    };
    return await this.create(newSubject);
  }

  @UseGuards(JwtAuthGuard)
  // @ApiOAuth2([])
  @Get('me')
  @ApiOkResponse({ type: PublicAuthSubject })
  public async meAPI(@Request() req): Promise<PublicAuthSubject> {
    console.log(req);
    return await this.me(req);
  }

  @Get(':jwt')
  @ApiParam({ type: String, name: 'jwt' })
  @ApiOkResponse()
  public async checkTokenAPI(@Param('jwt') jwt: string): Promise<boolean> {
    return await this.checkToken(jwt);
  }

  @MessagePattern('MSG_CHECK_TOKEN')
  public async checkTokenMQ(
    @Payload() data: any,
    @Ctx() context: RmqContext
  ): Promise<boolean> {
    // Logger.verbose(`Channel reference : ${context.getChannelRef()}`);
    // Logger.verbose(`Pattern           : ${context.getPattern()}`);
    // Logger.verbose(`Message           : ${context.getMessage()}`);
    // Logger.verbose(`Payload           : ${data.jwt}`);
    return await this.checkToken(data.jwt);
  }

  private async checkToken(jwt: string): Promise<boolean> {
    Logger.verbose('Checking jwt access token...', 'AUTH_MICROSERVICE');
    try {
      const res = await this.authService.validateToken(jwt);
      if (res && res.sub) {
        Logger.verbose(`Token is valid`, 'AUTH_MICROSERVICE');
        return true;
      } else {
        Logger.verbose('Token is NOT valid', 'AUTH_MICROSERVICE');
        return false;
      }
    } catch (err) {
      Logger.error(err);
      return false;
    }
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

  private async me(req: any): Promise<PublicAuthSubject> {
    console.log(req);
    // const token = await this.authService.validateToken();
    const subject = await this.subjectService.getByUsername('user1');
    return subject;
  }
}
