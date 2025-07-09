import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Organization domain',
    example: 'mycompany.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  domain?: string;

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
    description: 'Relevant keywords for the organization',
    example: ['technology', 'software', 'innovation'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relevantKeywords?: string[];
}
