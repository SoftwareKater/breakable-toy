import { ApiProperty } from '@nestjs/swagger';
import { Credentials } from './credentials.dto';
import { CreateAuthSubject as CreateAuthSubjectInterface } from '@breakable-toy/shared/util/auth-utils';

/** The entity that is authenticated, e.g. a user or another service */
export class CreateAuthSubject extends Credentials
  implements CreateAuthSubjectInterface {
  @ApiProperty({
    required: false,
    description: 'An alias to the username, to display in the frontend.',
    example: 'Johnny',
  })
  alias?: string;

  @ApiProperty({
    required: false,
    description: 'Email of the subject. Used by local strategy.',
    example: 'john@doe.com',
  })
  email?: string;

  @ApiProperty({
    required: false,
    description: 'Foreign id of an entity in the user microservice.',
    example: '5c91de4e-316c-40a4-8321-9f15b3ceeea5',
  })
  userId?: string;
}
