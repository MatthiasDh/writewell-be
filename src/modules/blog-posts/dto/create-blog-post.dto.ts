import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogPostDto {
  @ApiProperty({
    description: 'Blog post title',
    example: 'AI Trends in 2024: What to Expect',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Blog post content',
    example: 'In 2024, we can expect significant advances in AI technology...',
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    description: 'Blog post tags',
    example: ['AI', 'technology', 'trends', '2024'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
