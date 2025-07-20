import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationSettingsDto {
  @ApiProperty({
    description: 'Organization ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  organization_id: string;

  @ApiProperty({
    description: 'Supported languages',
    example: ['en', 'es', 'fr'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiProperty({
    description: 'Content tone',
    example: 'professional',
    required: false,
  })
  @IsOptional()
  @IsString()
  tone?: string;
}
