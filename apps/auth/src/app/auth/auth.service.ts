import {
  Injectable,
  Inject,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { TimeoutError, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { UserManagementMicroserviceName } from '../constants';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserManagementMicroserviceName)
    private readonly client: ClientProxy,
    private readonly jwtService: JwtService
  ) {}

  public async validateUsernamePassword(username: string, password: string): Promise<any> {
    const user = await this.client
      .send({ role: 'user', cmd: 'get' }, { username })
      .pipe(
        timeout(5000),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(new RequestTimeoutException());
          }
          return throwError(err);
        })
      )
      .toPromise();
    return new Promise((resolve, reject) => {
      compare(password, user?.password, (err, same) => {
        if (err) {
          reject(err);
        }
        if (same === true) {
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
  }

  public async login(user) {
    const payload = { user, sub: user.id };

    return {
      userId: user.id,
      accessToken: this.jwtService.sign(payload),
    };
  }
  
  public validateToken(jwt: string) {
    return this.jwtService.verify(jwt);
  }
}
