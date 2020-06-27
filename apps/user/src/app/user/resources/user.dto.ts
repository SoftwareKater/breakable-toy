import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    required: true,
  })
  id: string;

  @ApiProperty()
  username: string;
  
  @ApiProperty()
  alias: string;
  
  @ApiProperty()
  email: string;
  
  @ApiProperty()
  createdAt: number;
}
