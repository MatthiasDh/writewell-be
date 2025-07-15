import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentCalendarService } from './content-calendar.service';
import { ContentCalendarController } from './content-calendar.controller';
import { ContentCalendar } from './content-calendar.entity';
import { ContentItem } from '../content-items/content-item.entity';
import { ContentCalendarRepository } from './content-calendar.repository';
import { ContentItemsModule } from '../content-items/content-items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentCalendar, ContentItem]),
    ContentItemsModule,
  ],
  controllers: [ContentCalendarController],
  providers: [ContentCalendarService, ContentCalendarRepository],
  exports: [ContentCalendarService, ContentCalendarRepository],
})
export class ContentCalendarModule {}
