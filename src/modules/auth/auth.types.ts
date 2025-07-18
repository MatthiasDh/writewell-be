import { User } from '@clerk/backend';
import { ApiProperty } from '@nestjs/swagger';

export class AuthSuccessObject {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refresh_token: string;

  @ApiProperty({
    description: 'Token expiration timestamp (Unix timestamp)',
    example: 1703001600,
  })
  expires: number;
}

export type UserWithOrg = User & { orgId: string };
