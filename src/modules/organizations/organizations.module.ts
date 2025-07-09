import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { ContentCalendar } from '../../entities/content-calendar.entity';
import { PuppeteerService } from '../../common/services/puppeteer.service';
import { OpenAIService } from '../../common/services/openai.service';
import { DataForSEOService } from '../../common/services/dataforseo.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContentCalendar])],
  controllers: [OrganizationsController],
  providers: [
    OrganizationsService,
    PuppeteerService,
    OpenAIService,
    DataForSEOService,
  ],
  exports: [OrganizationsService, TypeOrmModule],
})
export class OrganizationsModule {}
