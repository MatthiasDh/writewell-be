import { ApiProperty } from '@nestjs/swagger';
import { ContentType } from '../../../entities/content-item.entity';

export class ContentItemResponseDto {
  @ApiProperty({
    description: 'Content item ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Content item type',
    enum: ContentType,
    example: ContentType.BLOG,
  })
  type: ContentType;

  @ApiProperty({
    description: 'Content item title',
    example: '10 Tips for Better SEO',
  })
  title: string;

  @ApiProperty({
    description: 'Content item content',
    example: 'Here are 10 tips to improve your SEO...',
  })
  content: string;

  @ApiProperty({
    description: 'Content item publish date',
    example: '2024-01-15T10:00:00.000Z',
  })
  publishDate: Date;

  @ApiProperty({
    description: 'Whether the content item is published',
    example: false,
  })
  isPublished: boolean;

  @ApiProperty({
    description: 'Content item creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Content item last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
