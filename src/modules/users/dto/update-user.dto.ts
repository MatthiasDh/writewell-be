import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Clerk user ID',
    example: 'user_2abcdef123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  clerk_user_id?: string;
}
