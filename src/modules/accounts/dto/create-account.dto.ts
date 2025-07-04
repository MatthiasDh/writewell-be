import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({
    description: 'Account title',
    example: 'My Company',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Account description',
    example: 'A leading technology company',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Relevant keywords for the account',
    example: ['technology', 'software', 'innovation'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relevantKeywords?: string[];
}
