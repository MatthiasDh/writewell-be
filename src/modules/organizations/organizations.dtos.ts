import { ApiProperty } from '@nestjs/swagger';
import { UpdateOrganizationParams } from './organizations.type';

export type UpdateOrganizationDto = UpdateOrganizationParams;

export class UpdateOrganizationMetadataDto {
  @ApiProperty({ description: 'Updated business title' })
  title: string;

  @ApiProperty({ description: 'Updated business summary' })
  summary: string;
}
