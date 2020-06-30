import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthSubject } from '../resources/auth-subject.dto';
import { LocalStrategyBadCredentialsMessage } from '../../constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  /** 
   * Calls auth service to validate the credentials.
   */
  public async validate(username: string, password: string): Promise<AuthSubject> {
    Logger.verbose('[LocalStrategy] Validating credentials...');
    let authSubject: AuthSubject;
    try {
      authSubject = await this.authService.validateCredentials(username, password);
    } catch(err) {
      Logger.error(`[LocalStrategy] AuthService failed to validate the credentials, error: ${err}`);
      throw new UnauthorizedException(LocalStrategyBadCredentialsMessage);
    }

    if(!authSubject) {
      throw new UnauthorizedException(LocalStrategyBadCredentialsMessage);
    }

    return authSubject;
  }
}
