import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { Tenant } from '../../entities/tenant.entity';
import { ContentCalendar } from '../../entities/content-calendar.entity';
import { PuppeteerService } from '../../common/services/puppeteer.service';
import { OpenAIService } from '../../common/services/openai.service';
import { DataForSEOService } from '../../common/services/dataforseo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, ContentCalendar])],
  controllers: [TenantsController],
  providers: [
    TenantsService,
    PuppeteerService,
    OpenAIService,
    DataForSEOService,
  ],
  exports: [TenantsService, TypeOrmModule],
})
export class TenantsModule {}
