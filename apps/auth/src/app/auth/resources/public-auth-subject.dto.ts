import { OmitType } from '@nestjs/swagger';
import { AuthSubject } from './auth-subject.dto';
import { PublicAuthSubject as PublicAuthSubjectInterface } from '@breakable-toy/shared/util/auth-utils';

/**
 * All properties of an auth subject except for the password hash.
 * Used to send inside an access token.
 */
export class PublicAuthSubject extends OmitType(AuthSubject, ['passwordHash'])
  implements PublicAuthSubjectInterface {}
