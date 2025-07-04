import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentCalendarService } from './content-calendar.service';
import { ContentCalendarController } from './content-calendar.controller';
import { ContentCalendar } from '../../entities/content-calendar.entity';
import { Account } from '../../entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContentCalendar, Account])],
  controllers: [ContentCalendarController],
  providers: [ContentCalendarService],
  exports: [ContentCalendarService, TypeOrmModule],
})
export class ContentCalendarModule {}
