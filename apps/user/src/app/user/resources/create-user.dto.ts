import { ApiProperty } from '@nestjs/swagger';

export class CreateUser {
  @ApiProperty({
    required: true,
  })
  username: string;

  @ApiProperty({
    required: true,
  })
  password: string;

  @ApiProperty({
    required: false,
  })
  alias?: string;

  @ApiProperty({
    required: false,
  })
  email?: string;
}
