import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContentStatus, ContentType } from '../scheduled-content-item.entity';

export class UpdateScheduledContentItemDto {
  @ApiProperty({
    description: 'Scheduled date',
    example: '2024-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  scheduled_date?: string;

  @ApiProperty({
    description: 'Content status',
    enum: ContentStatus,
    example: ContentStatus.PLANNED,
    required: false,
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiProperty({
    description: 'Content generation prompt',
    example: 'Write a blog post about AI trends in 2024',
    required: false,
  })
  @IsOptional()
  @IsString()
  prompt?: string;

  @ApiProperty({
    description: 'Content type',
    enum: ContentType,
    example: ContentType.BLOG,
    required: false,
  })
  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;

  @ApiProperty({
    description: 'Content sub-type',
    example: 'how-to-guide',
    required: false,
  })
  @IsOptional()
  @IsString()
  content_type?: string;

  @ApiProperty({
    description: 'Content sub-type variation',
    example: 'beginner-friendly',
    required: false,
  })
  @IsOptional()
  @IsString()
  content_sub_type?: string;

  @ApiProperty({
    description: 'Metadata for content optimization',
    example: { search_volume: 1200, difficulty: 45, cpc: 2.5 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
