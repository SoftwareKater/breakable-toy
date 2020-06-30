import { ApiProperty } from '@nestjs/swagger';
import { Credentials } from './credentials.dto';

/** The entity that is authenticated, e.g. a user or another service */
export class CreateAuthSubject extends Credentials {
  @ApiProperty({
    required: false,
    description: 'An alias to the username, to display in the frontend.',
  })
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Email of the subject. Used by local strategy.',
  })
  email?: string;
}
