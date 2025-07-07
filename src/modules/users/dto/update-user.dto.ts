import { PartialType, OmitType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { SignUpUserDto } from '../../auth/dto/signup-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(SignUpUserDto, ['password'] as const),
) {
  @IsOptional()
  @IsString()
  refreshToken?: string | null;

  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  tenants?: string[];
}
