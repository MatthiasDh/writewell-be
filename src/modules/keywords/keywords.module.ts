import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeywordService } from './keywords.service';
import { KeywordsController } from './keywords.controller';
import { Keyword } from './keyword.entity';
import { KeywordRepository } from './keywords.repository';
import { DataForSEOService } from '../../common/services/dataforseo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword])],
  controllers: [KeywordsController],
  providers: [KeywordService, KeywordRepository, DataForSEOService],
  exports: [KeywordService, KeywordRepository],
})
export class KeywordModule {}
