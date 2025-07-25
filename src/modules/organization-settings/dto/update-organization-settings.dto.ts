import { IsOptional, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrganizationSettingsDto {
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
