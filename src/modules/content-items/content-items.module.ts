import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentItemsService } from './content-items.service';
import { ContentItemsController } from './content-items.controller';
import { ContentItem } from './content-item.entity';
import { ContentCalendar } from '../content-calendar/content-calendar.entity';
import { ContentItemRepository } from './content-item.repository';
import { ContentCalendarRepository } from '../content-calendar/content-calendar.repository';
import { LLMService } from '../../common/services/llm.service';
import { ContentCalendarService } from '../content-calendar/content-calendar.service';
import { KeywordRepository } from '../keywords/keywords.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ContentItem, ContentCalendar])],
  controllers: [ContentItemsController],
  providers: [
    ContentItemsService,
    ContentItemRepository,
    LLMService,
    ContentCalendarService,
    ContentCalendarRepository,
    KeywordRepository,
  ],
  exports: [ContentItemsService, ContentItemRepository],
})
export class ContentItemsModule {}
