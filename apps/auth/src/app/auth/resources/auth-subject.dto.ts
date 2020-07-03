import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateAuthSubject } from './create-auth-subject.dto';

/** The entity that is authenticated, e.g. a user or another service */
export class AuthSubject extends OmitType(CreateAuthSubject, ['password']) {
  @ApiProperty({
    required: true,
    description: 'Unique identifier of the subject.',
    example: '9505f7a6-7a78-4007-8c20-4c086270eb24'
  })
  id: string;

  @ApiProperty({
    required: false,
    description: 'Hashed password of the subject. Used by local strategy.',
  })
  passwordHash?: string;

  @ApiProperty({
    required: false,
    example: 1593719763106,
  })
  createdAt?: number;
}
