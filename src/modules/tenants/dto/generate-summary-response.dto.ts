import { ApiProperty } from '@nestjs/swagger';

export class TenantSummaryResponseDto {
  @ApiProperty({ description: 'Updated business title' })
  title: string;

  @ApiProperty({ description: 'Updated business summary' })
  summary: string;
}
