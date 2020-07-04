import { Injectable } from '@angular/core';
import {
  AuthService as AuthApiService,
  Credentials,
} from '@breakable-toy/shared/data-access/auth-api-client';
import { UserService as UserApiService } from '@breakable-toy/shared/data-access/user-api-client';
import { SessionService } from '../shared/services/session.service';
import * as jwtDecode from 'jwt-decode';

@Injectable()
export class AuthService {
  constructor(
    private readonly authApiService: AuthApiService,
    private readonly sessionService: SessionService,
    private readonly userApiService: UserApiService
  ) {}

  public async login(username: string, password: string): Promise<boolean> {
    const credentials: Credentials = {
      username,
      password,
    };
    try {
      const res = await this.authApiService.login(credentials).toPromise();
      if (res?.accessToken) {
        const token = res.accessToken;
        this.sessionService.accessToken = token;

        const userId = this.extractUserIdFromToken(token);
        const user = await this.userApiService.getById(userId).toPromise();
        this.sessionService.user = user;
        return true;
      }
      // No token was returned, i.e. credentails are not valid.
      return false;
    } catch (err) {
      console.error(err);
    }
  }

  private extractUserIdFromToken(accessToken: string): string {
    const decoded: any = this.decodeJwt(accessToken);
    const id = decoded.subject.userId;
    return id;
  }

  private decodeJwt(accessToken: string): object {
    const decoded = jwtDecode<object>(accessToken);
    return decoded;
  }
}
