import { ApiProperty } from '@nestjs/swagger';

export class TenantResponseDto {
  @ApiProperty({
    description: 'Tenant ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Tenant title',
    example: 'My Company',
  })
  title: string;

  @ApiProperty({
    description: 'Tenant description',
    example: 'A leading technology company',
  })
  description: string;

  @ApiProperty({
    description: 'Relevant keywords for the tenant',
    example: ['technology', 'software', 'innovation'],
  })
  relevantKeywords: string[];

  @ApiProperty({
    description: 'Tenant creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Tenant last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
