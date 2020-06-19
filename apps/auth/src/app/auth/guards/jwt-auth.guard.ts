import {
  CanActivate,
  Inject,
  ExecutionContext,
  Logger,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

/** This should be moved to a library to be reused by other microservices */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  /** maybe i should move this to jwt strategy, like with local auth */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    Logger.verbose('[JwtAuthGuard] Validating access token...');
    const req = context.switchToHttp().getRequest();
    const accessToken = req.headers['authorization']?.split(' ')[1];
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.authService.validateToken(accessToken);
        if (res !== null && res !== false) {
          Logger.verbose('[JwtAuthGuard] Token is valid');
          resolve(true);
        } else {
          Logger.verbose('[JwtAuthGuard] Token is not valid');
          resolve(false);
        }
      } catch (err) {
        Logger.verbose(`[JwtAuthGuard] Token is not valid. Reason: ${err.message}`);      
        resolve(false);
      }
    });
  }
}
