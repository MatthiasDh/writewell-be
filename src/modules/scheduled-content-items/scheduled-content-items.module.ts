import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledContentItemsController } from './scheduled-content-items.controller';
import { ScheduledContentItemsService } from './scheduled-content-items.service';
import { ScheduledContentItem } from './scheduled-content-item.entity';
import { ScheduledContentItemsRepository } from './scheduled-content-items.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduledContentItem])],
  controllers: [ScheduledContentItemsController],
  providers: [ScheduledContentItemsService, ScheduledContentItemsRepository],
  exports: [
    ScheduledContentItemsService,
    ScheduledContentItemsRepository,
    TypeOrmModule,
  ],
})
export class ScheduledContentItemsModule {}
