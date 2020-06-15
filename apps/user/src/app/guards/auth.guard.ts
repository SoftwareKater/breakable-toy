import { CanActivate, Inject, ExecutionContext, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';

/** This should be moved to a library to be reused by other microservices */
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.client
          .send(
            { role: 'auth', cmd: 'check' },
            { jwt: req.headers['authorization']?.split(' ')[1] }
          )
          .pipe(timeout(5000))
          .toPromise/*<boolean>*/();

        resolve(true);
      } catch (err) {
        Logger.error(err);
        resolve(false);
      }
    });
  }
}
