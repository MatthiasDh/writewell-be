import { ApiProperty } from '@nestjs/swagger';

export class BusinessRelevantKeywordsRequestDto {
  @ApiProperty()
  context: string;
}
