import { ApiProperty } from '@nestjs/swagger';

export class KeywordRequestDto {
  @ApiProperty()
  keywords: string[];
}

export class KeywordItemDto {
  @ApiProperty({
    description: 'The keyword',
    example: 'example',
  })
  keyword: string;

  @ApiProperty({
    description: 'Monthly search volume for the keyword',
    example: 1000,
  })
  search_volume: number;

  @ApiProperty({
    description: 'Cost per click for the keyword',
    example: 1.5,
  })
  cpc: number;

  @ApiProperty({
    description: 'Competition level for the keyword',
    example: 'MEDIUM',
    enum: ['LOW', 'MEDIUM', 'HIGH'],
  })
  competition: 'LOW' | 'MEDIUM' | 'HIGH';

  @ApiProperty({
    description: 'Competition index (0-100)',
    example: 50,
  })
  competition_index: number;

  @ApiProperty({
    description: 'Low top of page bid',
    example: 0.5,
  })
  low_top_of_page_bid: number;

  @ApiProperty({
    description: 'High top of page bid',
    example: 2.0,
  })
  high_top_of_page_bid: number;
}

export class KeywordResponseDto {
  @ApiProperty({
    type: [KeywordItemDto],
  })
  keywords: KeywordItemDto[];
}
