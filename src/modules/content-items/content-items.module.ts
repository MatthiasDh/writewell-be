import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentItemsService } from './content-items.service';
import { ContentItemsController } from './content-items.controller';
import { ContentItem } from '../../entities/content-item.entity';
import { ContentCalendar } from '../content-calendar/content-calendar.entity';
import { ContentItemRepository } from './content-item.repository';
import { ContentCalendarRepository } from '../content-calendar/content-calendar.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ContentItem, ContentCalendar])],
  controllers: [ContentItemsController],
  providers: [
    ContentItemsService,
    ContentItemRepository,
    ContentCalendarRepository,
  ],
  exports: [
    ContentItemsService,
    ContentItemRepository,
    ContentCalendarRepository,
  ],
})
export class ContentItemsModule {}
