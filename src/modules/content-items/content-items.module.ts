import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentItemsService } from './content-items.service';
import { ContentItemsController } from './content-items.controller';
import { ContentItem } from '../../entities/content-item.entity';
import { ContentCalendar } from '../../entities/content-calendar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContentItem, ContentCalendar])],
  controllers: [ContentItemsController],
  providers: [ContentItemsService],
  exports: [ContentItemsService, TypeOrmModule],
})
export class ContentItemsModule {}
