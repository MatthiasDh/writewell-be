import { ApiProperty } from '@nestjs/swagger';

export class OrganizationSummaryResponseDto {
  @ApiProperty({ description: 'Updated business title' })
  title: string;

  @ApiProperty({ description: 'Updated business summary' })
  summary: string;
}
