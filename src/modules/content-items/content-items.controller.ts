import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContentItemsService } from './content-items.service';

@ApiTags('content-items')
@Controller('content-items')
export class ContentItemsController {
  constructor(private readonly contentItemsService: ContentItemsService) {}
}
