import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateContentItemDto } from './create-content-item.dto';

export class UpdateContentItemDto extends PartialType(
  OmitType(CreateContentItemDto, ['contentCalendarId'] as const),
) {}
