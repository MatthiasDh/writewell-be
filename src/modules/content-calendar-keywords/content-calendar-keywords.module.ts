import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentCalendarKeyword } from './content-calendar-keyword.entity';
import { ContentCalendarKeywordRepository } from './content-calendar-keyword.repository';
import { ContentCalendarKeywordService } from './content-calendar-keyword.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContentCalendarKeyword])],
  providers: [ContentCalendarKeywordService, ContentCalendarKeywordRepository],
  exports: [ContentCalendarKeywordService, ContentCalendarKeywordRepository],
})
export class ContentCalendarKeywordsModule {}
