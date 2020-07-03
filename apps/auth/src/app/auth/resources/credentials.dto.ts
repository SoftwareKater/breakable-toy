import { ApiProperty } from '@nestjs/swagger';

/** Name and password (plain-text) for authentication with local strategy */
export class Credentials {
  @ApiProperty({
    required: false,
    description: 'Unique name of a subject. Used by local strategy.',
    example: 'John Doe',
  })
  username: string;

  @ApiProperty({
    required: false,
    description: 'Password of a subject. Used by local strategy.',
    example: '1234'
  })
  password: string;
}
