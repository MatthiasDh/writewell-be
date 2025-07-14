import { ApiProperty } from '@nestjs/swagger';

export class OrganizationSummaryResponseDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  summary: string;
}
