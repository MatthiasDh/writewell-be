import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentCalendarService } from './content-calendar.service';
import { ContentCalendarController } from './content-calendar.controller';
import { ContentCalendar } from '../../entities/content-calendar.entity';
import { Tenant } from '../../entities/tenant.entity';
import { ContentItem } from '../../entities/content-item.entity';
import { OpenAIService } from '../../common/services/openai.service';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentCalendar, Tenant, ContentItem]),
    TenantsModule,
  ],
  controllers: [ContentCalendarController],
  providers: [ContentCalendarService, OpenAIService],
  exports: [ContentCalendarService, TypeOrmModule],
})
export class ContentCalendarModule {}
