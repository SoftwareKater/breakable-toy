import { CanActivate, Inject, ExecutionContext, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';
import { AUTH_MICROSERVICE_TCP_CONNECTION_PROVIDER_NAME } from '../constants';

export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_MICROSERVICE_TCP_CONNECTION_PROVIDER_NAME)
    private readonly client: ClientProxy
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    Logger.verbose(
      'Sending a message to the auth microservice to validate the access token.'
    );
    const req = context.switchToHttp().getRequest();
    return new Promise(async (resolve, reject) => {
      try {
        const pattern = { role: 'auth', cmd: 'check' };
        const payload = { jwt: req.headers['authorization']?.split(' ')[1] };
        const res = await this.client
          .send(pattern, payload)
          .pipe(timeout(5000))
          .toPromise /*<boolean>*/
          ();
        if (res) {
          Logger.verbose('Validation succeeded: user is authorized.');
          resolve(true);
        } else {
          Logger.verbose('Validation succeeded: user is NOT authorized.');
          resolve(false);
        }
      } catch (err) {
        Logger.verbose(`Validation failed.`);
        Logger.error(err);
        resolve(false);
      }
    });
  }
}
