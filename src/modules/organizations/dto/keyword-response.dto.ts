import { ApiProperty } from '@nestjs/swagger';

export class KeywordResponseDto {
  @ApiProperty({
    description: 'Keyword ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'The keyword text',
    example: 'software',
  })
  keyword: string;

  @ApiProperty({
    description: 'Monthly search volume',
    example: 368000,
  })
  search_volume: number;

  @ApiProperty({
    description: 'Cost per click in USD',
    example: 3.99,
  })
  cpc: number;

  @ApiProperty({
    description: 'Competition level',
    example: 'LOW',
  })
  competition: string;

  @ApiProperty({
    description: 'Competition index (0-100)',
    example: 8,
  })
  competition_index: number;

  @ApiProperty({
    description: 'Low top of page bid',
    example: 1.06,
  })
  low_top_of_page_bid: number;

  @ApiProperty({
    description: 'High top of page bid',
    example: 5.36,
  })
  high_top_of_page_bid: number;

  @ApiProperty({
    description: 'Keyword creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Keyword last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updated_at: Date;
}
