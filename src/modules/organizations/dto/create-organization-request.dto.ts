import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationRequestDto {
  @ApiProperty({
    description: 'Organization domain',
    example: 'mycompany.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  domain: string;

  @ApiProperty({
    description: 'Organization title',
    example: 'My Company',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Organization description',
    example: 'A leading technology company',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Relevant keyword IDs for the organization',
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '550e8400-e29b-41d4-a716-446655440001',
    ],
  })
  @IsArray()
  exampleBlogPostUrls: string[];
}
