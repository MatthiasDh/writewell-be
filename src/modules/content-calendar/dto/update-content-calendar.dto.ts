import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateContentCalendarDto } from './create-content-calendar.dto';

export class UpdateContentCalendarDto extends PartialType(
  OmitType(CreateContentCalendarDto, ['accountId'] as const),
) {}
