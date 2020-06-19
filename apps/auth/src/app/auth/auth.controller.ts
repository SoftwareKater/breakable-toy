import {
  Controller,
  UseGuards,
  Post,
  Logger,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { MessagePattern } from '@nestjs/microservices';
import {
  ApiOkResponse,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AuthSubject } from './resources/auth-subject.dto';
import { Credentials } from './resources/credentials.dto';
import { TokenResponse } from './resources/token-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateAuthSubject } from './resources/create-auth-subject.dto';
import { MongoAuthSubjectService } from './mongo-auth-subject.service';
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
  @ApiCreatedResponse({ type: AuthSubject })
  public async createAuthSubject(
    @Body() subject: CreateAuthSubject
  ): Promise<PublicAuthSubject> {
    try {
      const sub = await this.subjectService.create(subject);
      return sub;
    } catch (err) {
      Logger.error(`createAuthSubject failed with error: ${err}`);
    }
  }

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

  @Get(':jwt')
  @ApiParam({ type: String, name: 'jwt' })
  @ApiOkResponse()
  public async checkToken(@Param('jwt') jwt: string): Promise<boolean> {
    try {
      const res = await this.authService.validateToken(jwt);
      return res;
    } catch (err) {
      Logger.error(`JWT Access Token validation threw error: ${err}`);
      return false;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  public async test(): Promise<string> {
    return 'You have a valid jwt access token';
  }
}
