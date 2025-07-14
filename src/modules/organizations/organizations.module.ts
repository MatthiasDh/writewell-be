import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { ContentCalendar } from '../content-calendar/content-calendar.entity';
import { ContentItem } from '../../entities/content-item.entity';
import { PuppeteerService } from '../../common/services/puppeteer.service';
import { OpenAIService } from '../../common/services/openai.service';
import { DataForSEOService } from '../../common/services/dataforseo.service';
import { ClerkClientProvider } from '../../providers/clerk.provider';
import { OrganizationRegistrationService } from '../../flows/organization-registration/organization-registration.service';
import { UsersService } from '../users/users.service';
import { ContentCalendarModule } from '../content-calendar/content-calendar.module';
import { ContentItemsModule } from '../content-items/content-items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentCalendar, ContentItem]),
    ContentCalendarModule,
    ContentItemsModule,
  ],
  controllers: [OrganizationsController],
  providers: [
    OrganizationsService,
    PuppeteerService,
    OpenAIService,
    DataForSEOService,
    ClerkClientProvider,
    UsersService,
    OrganizationRegistrationService,
  ],
  exports: [OrganizationsService, TypeOrmModule],
})
export class OrganizationsModule {}
