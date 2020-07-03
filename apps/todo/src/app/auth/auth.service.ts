import { Injectable } from '@angular/core';
import {
  AuthService as AuthApiService,
  Credentials,
} from '@breakable-toy/shared/data-access/auth-api-client';
import { SessionService } from '../shared/services/session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authApiService: AuthApiService,
    private readonly sessionService: SessionService
  ) {}

  public async login(username: string, password: string): Promise<boolean> {
    const credentials: Credentials = {
      username,
      password,
    };
    try {
      const res = await this.authApiService
        .login(credentials)
        .toPromise();
      if (res?.accessToken) {
        this.sessionService.accessToken = res.accessToken;
        return true;
      }
      // No token was returned, i.e. credentails are not valid.
      return false;
    } catch (err) {
      console.error(err);
    }
  }
}
