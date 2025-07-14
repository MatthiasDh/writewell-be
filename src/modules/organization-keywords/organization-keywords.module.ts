import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationKeyword } from '../organization-keywords/organization-keywords.entity';
import { OrganizationKeywordRepository } from '../organization-keywords/organization-keyword.repository';
import { DataForSEOService } from '../../common/services/dataforseo.service';
import { Keyword } from '../keywords/keyword.entity';
import { KeywordRepository } from '../keywords/keywords.repository';
import { OpenAIService } from '../../common/services/openai.service';
import { OrganizationKeywordsController } from './organization-keywords.controller';
import { OrganizationKeywordService } from './organization-keyword.service';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword, OrganizationKeyword])],
  controllers: [OrganizationKeywordsController],
  providers: [
    OrganizationKeywordService,
    OrganizationKeywordRepository,
    KeywordRepository,
    DataForSEOService,
    OpenAIService,
  ],
  exports: [OrganizationKeywordService, OrganizationKeywordRepository],
})
export class OrganizationKeywordsModule {}
