import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContentCalendarDto {
  @ApiProperty({
    description: 'Content calendar name',
    example: 'Q1 2024 Marketing Calendar',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Content calendar description',
    example: 'Marketing content calendar for Q1 2024',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Account ID that owns this calendar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4')
  @IsNotEmpty()
  accountId: string;
}
