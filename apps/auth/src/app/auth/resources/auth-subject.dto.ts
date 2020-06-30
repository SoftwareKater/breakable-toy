import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateAuthSubject } from './create-auth-subject.dto';

/** The entity that is authenticated, e.g. a user or another service */
export class AuthSubject extends OmitType(CreateAuthSubject, ['password']) {
  @ApiProperty({
    required: true,
    description: 'Unique identifier of the subject.',
  })
  id: string;

  @ApiProperty({
    required: false,
    description: 'Hashed password of the subject. Used by local strategy.',
  })
  passwordHash?: string;

  @ApiProperty({
    required: false,
    description:
      'Granted, if subject is authenticated. (I think this is unnecessary)',
  })
  accessToken?: string;

  @ApiProperty({
    required: false,
  })
  createdAt?: number;
}
