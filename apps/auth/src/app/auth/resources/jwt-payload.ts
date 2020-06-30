import { PublicAuthSubject } from './public-auth-subject.dto';

export interface JwtPayload {
  subject: PublicAuthSubject;
  sub: string;
  ext?: string;
  iat?: string;
}
