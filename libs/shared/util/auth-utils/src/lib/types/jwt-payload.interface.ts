import { PublicAuthSubject } from './public-auth-subject.interface';

export interface JwtPayload {
  subject: PublicAuthSubject;
  sub: string;
  exp?: string;
  iat?: string;
}
