import { ApiProperty } from '@nestjs/swagger';
import { ContentItemResponseDto } from '../../content-items/dto/content-item-response.dto';

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
    example: 'Marketing content calendar for the first quarter of 2024',
    nullable: true,
  })
  description: string | null;

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

  @ApiProperty({
    description: 'Array of content items belonging to this calendar',
    type: [ContentItemResponseDto],
  })
  contentItems: ContentItemResponseDto[];
}
