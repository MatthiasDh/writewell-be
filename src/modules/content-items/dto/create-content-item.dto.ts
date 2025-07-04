import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContentType } from '../../../entities/content-item.entity';

export class CreateContentItemDto {
  @ApiProperty({
    description: 'Content item type',
    enum: ContentType,
    example: ContentType.BLOG,
  })
  @IsEnum(ContentType)
  @IsNotEmpty()
  type: ContentType;

  @ApiProperty({
    description: 'Content item title',
    example: '10 Tips for Better SEO',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Content item content',
    example: 'Here are 10 tips to improve your SEO...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Content item publish date',
    example: '2024-01-15T10:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  publishDate: Date;

  @ApiProperty({
    description: 'Whether the content item is published',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({
    description: 'Content calendar ID that owns this item',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4')
  @IsNotEmpty()
  contentCalendarId: string;
}
