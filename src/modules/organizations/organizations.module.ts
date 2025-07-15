import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { ContentCalendar } from '../content-calendar/content-calendar.entity';
import { ContentItem } from '../content-items/content-item.entity';
import { ClerkClientProvider } from '../../providers/clerk.provider';
import { OrganizationRegistrationService } from '../../flows/organization-registration/organization-registration.service';
import { UsersService } from '../users/users.service';
import { ContentCalendarModule } from '../content-calendar/content-calendar.module';
import { ContentItemsModule } from '../content-items/content-items.module';
import { KeywordModule } from '../keywords/keywords.module';
import { PuppeteerService } from '../../common/services/puppeteer.service';
import { LLMService } from '../../common/services/llm.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentCalendar, ContentItem]),
    ContentCalendarModule,
    ContentItemsModule,
    KeywordModule,
  ],
  controllers: [OrganizationsController],
  providers: [
    OrganizationsService,
    PuppeteerService,
    LLMService,
    ClerkClientProvider,
    UsersService,
    OrganizationRegistrationService,
  ],
  exports: [OrganizationsService, TypeOrmModule],
})
export class OrganizationsModule {}
