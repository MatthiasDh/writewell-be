import { ApiProperty } from '@nestjs/swagger';

export class WebsiteSummaryResponseDTO {
  @ApiProperty()
  title: string;

  @ApiProperty()
  summary: string;
}

export class WebsiteSummaryRequestDto {
  @ApiProperty()
  url: string;
}

export class BusinessRelevantKeywordsResponseDTO {
  @ApiProperty()
  keywords: string[];
}

export class BusinessRelevantKeywordsRequestDto {
  @ApiProperty()
  context: string;
}
