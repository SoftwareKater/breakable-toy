import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse {
  @ApiProperty({
    required: false,
    description: 'Granted, if subject is authenticated.',
  })
  accessToken: string;
}
