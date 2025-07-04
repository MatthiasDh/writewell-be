import { ApiProperty } from '@nestjs/swagger';

export class ContentCalendarResponseDto {
  @ApiProperty({
    description: 'Content calendar ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Content calendar name',
    example: 'Q1 2024 Marketing Calendar',
  })
  name: string;

  @ApiProperty({
    description: 'Content calendar description',
    example: 'Marketing content calendar for Q1 2024',
  })
  description: string;

  @ApiProperty({
    description: 'Content calendar creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Content calendar last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
