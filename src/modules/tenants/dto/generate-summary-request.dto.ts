import { ApiProperty } from '@nestjs/swagger';

export class TenantSummaryRequestDto {
  @ApiProperty({
    description: 'Website URL to analyze',
  })
  url: string;
}
