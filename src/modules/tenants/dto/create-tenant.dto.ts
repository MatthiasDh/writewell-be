import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({
    description: 'Tenant domain',
    example: 'mycompany.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  domain?: string;

  @ApiProperty({
    description: 'Tenant title',
    example: 'My Company',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Tenant description',
    example: 'A leading technology company',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Relevant keywords for the tenant',
    example: ['technology', 'software', 'innovation'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relevantKeywords?: string[];
}
