import { ApiProperty } from '@nestjs/swagger';
import { Credentials as CredentialsInterface } from '@breakable-toy/shared/util/auth-utils';

/** Name and password (plain-text) for authentication with local strategy */
export class Credentials implements CredentialsInterface {
  @ApiProperty({
    required: false,
    description: 'Unique name of a subject. Used by local strategy.',
    example: 'John Doe',
  })
  username: string;

  @ApiProperty({
    required: false,
    description: 'Password of a subject. Used by local strategy.',
    example: '1234',
  })
  password: string;
}
