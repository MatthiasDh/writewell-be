import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentCalendarService } from './content-calendar.service';
import { ContentCalendarController } from './content-calendar.controller';
import { ContentCalendar } from './content-calendar.entity';
import { ContentItem } from '../../entities/content-item.entity';
import { ContentCalendarRepository } from './content-calendar.repository';
import { ContentCalendarKeywordsModule } from '../content-calendar-keywords/content-calendar-keywords.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentCalendar, ContentItem]),
    ContentCalendarKeywordsModule,
  ],
  controllers: [ContentCalendarController],
  providers: [ContentCalendarService, ContentCalendarRepository],
  exports: [
    ContentCalendarService,
    ContentCalendarRepository,
    ContentCalendarKeywordsModule,
  ],
})
export class ContentCalendarModule {}
