import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrganizationDto {
  @ApiProperty({
    description: 'Organization name',
    example: 'Acme Corp',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Organization description',
    example: 'Leading provider of innovative solutions',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Organization domain',
    example: 'acmecorp.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiProperty({
    description: 'Target audience segments',
    example: ['small businesses', 'enterprise clients'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  target_audience?: string[];

  @ApiProperty({
    description: 'Example blog post URLs for reference',
    example: [
      'https://acmecorp.com/blog/post1',
      'https://acmecorp.com/blog/post2',
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  example_blog_post_urls?: string[];
}
