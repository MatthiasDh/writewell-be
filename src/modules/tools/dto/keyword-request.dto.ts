import { IsString } from 'class-validator';

export class KeywordRequestDto {
  @IsString()
  text: string;
}
