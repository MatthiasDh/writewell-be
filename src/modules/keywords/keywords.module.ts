import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeywordService } from './keywords.service';
import { KeywordsController } from './keywords.controller';
import { Keyword } from './keyword.entity';
import { KeywordRepository } from './keywords.repository';
import { DataForSEOService } from '../../common/services/dataforseo.service';
import { LLMService } from '../../common/services/llm.service';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword])],
  controllers: [KeywordsController],
  providers: [KeywordService, KeywordRepository, DataForSEOService, LLMService],
  exports: [KeywordService, KeywordRepository],
})
export class KeywordModule {}
