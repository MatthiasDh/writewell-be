import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTenantDto } from './create-tenant.dto';
import { IsArray, IsOptional } from 'class-validator';

export class UpdateTenantDto extends PartialType(CreateTenantDto) {
  @ApiProperty({
    description: 'Tenant keywords',
    example: ['keyword1', 'keyword2', 'keyword3'],
  })
  @IsArray()
  @IsOptional()
  keywords?: string[];
}
