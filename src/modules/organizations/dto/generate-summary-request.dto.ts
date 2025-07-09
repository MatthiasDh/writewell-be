import { ApiProperty } from '@nestjs/swagger';

export class OrganizationSummaryRequestDto {
  @ApiProperty({
    description: 'Website URL to analyze',
  })
  url: string;
}
