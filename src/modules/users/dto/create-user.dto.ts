import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Clerk user ID',
    example: 'user_2abcdef123456789',
  })
  @IsString()
  @IsNotEmpty()
  clerk_user_id: string;
}
