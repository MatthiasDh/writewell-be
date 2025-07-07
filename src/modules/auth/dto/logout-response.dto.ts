import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Logout status message',
    example: 'Logged out successfully',
  })
  message: string;

  @ApiProperty({
    description: 'User ID that was logged out',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;
}
