import { ApiProperty } from '@nestjs/swagger';

export class AccountResponseDto {
  @ApiProperty({
    description: 'Account ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Account title',
    example: 'My Company',
  })
  title: string;

  @ApiProperty({
    description: 'Account description',
    example: 'A leading technology company',
  })
  description: string;

  @ApiProperty({
    description: 'Relevant keywords for the account',
    example: ['technology', 'software', 'innovation'],
  })
  relevantKeywords: string[];

  @ApiProperty({
    description: 'Account creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Account last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
