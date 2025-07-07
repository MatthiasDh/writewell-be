import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Invalid credentials',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2023-12-19T10:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'API path where error occurred',
    example: '/api/auth/login',
  })
  path: string;
}
