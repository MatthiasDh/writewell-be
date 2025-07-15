import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateOrganizationKeywordsDto {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  keywordIds: string[];
}
