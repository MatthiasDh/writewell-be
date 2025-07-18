import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Clerk organization ID',
    example: 'org_2abcdef123456789',
  })
  @IsString()
  @IsNotEmpty()
  clerk_organization_id: string;

  @ApiProperty({
    description: 'Organization name',
    example: 'Acme Corp',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

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
