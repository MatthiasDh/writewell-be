import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentCalendarService } from './content-calendar.service';
import { ContentCalendarController } from './content-calendar.controller';
import { ContentCalendar } from '../../entities/content-calendar.entity';
import { ContentItem } from '../../entities/content-item.entity';
import { OpenAIService } from '../../common/services/openai.service';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentCalendar, ContentItem]),
    OrganizationsModule,
  ],
  controllers: [ContentCalendarController],
  providers: [ContentCalendarService, OpenAIService],
  exports: [ContentCalendarService, TypeOrmModule],
})
export class ContentCalendarModule {}
