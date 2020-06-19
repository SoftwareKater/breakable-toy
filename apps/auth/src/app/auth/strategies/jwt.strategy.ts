import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JwtSecret } from '../../constants';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtSecret, // configService.get('authService.jwtSecret'), // naha, this should be env var
      // problem: super must be called before this -> cannot do this.configService.get(...)
    });
  }

  public async validate(payload) {
    Logger.verbose('[JwtStrategy] Validating access token...');
    return { id: payload.sub, user: payload.user };
  }
}
