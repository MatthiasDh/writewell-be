import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Keyword } from './keyword.entity';
import { KeywordRepository } from './keywords.repository';
import { DataForSEOService } from '../../common/services/dataforseo.service';

@Injectable()
export class KeywordService {
  constructor(
    private readonly keywordRepository: KeywordRepository,
    private readonly dataForSEOService: DataForSEOService,
  ) {}

  async getKeywordInsights(keywords: string[]): Promise<Keyword[]> {
    const keywordsInsights =
      await this.dataForSEOService.getKeywordsInsights(keywords);

    const mappedKeywords: Omit<Keyword, 'id' | 'created_at' | 'updated_at'>[] =
      keywordsInsights.map((keyword) => ({
        keyword: keyword.keyword,
        search_volume: keyword.search_volume,
        cpc: keyword.cpc,
        competition: keyword.competition,
        competition_index: keyword.competition_index,
        low_top_of_page_bid: keyword.low_top_of_page_bid,
        high_top_of_page_bid: keyword.high_top_of_page_bid,
        contentCalendars: [],
      }));

    const createdKeywords =
      await this.keywordRepository.createMultiple(mappedKeywords);

    return createdKeywords;
  }

  async create(keywordData: Partial<Keyword>): Promise<Keyword> {
    return this.keywordRepository.create(keywordData);
  }

  async findAll(): Promise<Keyword[]> {
    return this.keywordRepository.findAll();
  }

  async findOne(id: string): Promise<Keyword> {
    const keyword = await this.keywordRepository.findOne(id);
    if (!keyword) {
      throw new HttpException('Keyword not found', HttpStatus.NOT_FOUND);
    }
    return keyword;
  }

  async findByKeyword(keyword: string): Promise<Keyword | null> {
    return this.keywordRepository.findByKeyword(keyword);
  }
}
