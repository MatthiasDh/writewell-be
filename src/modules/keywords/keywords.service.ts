import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Keyword } from './keyword.entity';
import { KeywordRepository } from './keywords.repository';
import { DataForSEOService } from '../../common/services/dataforseo.service';
import { LLMService } from '../../common/services/llm.service';

@Injectable()
export class KeywordService {
  constructor(
    private readonly keywordRepository: KeywordRepository,
    private readonly dataForSEOService: DataForSEOService,
    private readonly llmService: LLMService,
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

  async findAllByCalendarId(calendarId: string): Promise<Keyword[]> {
    return this.keywordRepository.findAllByCalendarId(calendarId);
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

  async findKeywordsForBusinessDescription(
    description: string,
  ): Promise<Keyword[]> {
    try {
      // Get relevant keywords from the business context
      const businessRelevantKeywords =
        await this.llmService.getBusinessKeywords(description);

      // Convert keywords to lowercase for case-insensitive comparison
      const lowercaseBusinessKeywords = businessRelevantKeywords.map((k) =>
        k.toLowerCase(),
      );

      // Check if the keywords already exist in the database (case-insensitive)
      const existingKeywords = await this.keywordRepository.findMultiple(
        lowercaseBusinessKeywords,
      );

      // Create a set of existing keyword strings for easy lookup
      const existingKeywordStrings = existingKeywords.map((k) =>
        k.keyword.toLowerCase(),
      );

      // Find keywords that don't exist in the database
      const newKeywordsToFetch = lowercaseBusinessKeywords.filter(
        (keyword) => !existingKeywordStrings.includes(keyword),
      );

      let newKeywordObjects: Keyword[] = [];

      // We don't need to fetch new keywords if they already exist in the database
      if (newKeywordsToFetch.length <= 0) {
        return existingKeywords;
      }

      // If there are new keywords, fetch insights and create them
      const keywordInsights =
        await this.dataForSEOService.getKeywordsInsights(newKeywordsToFetch);

      // Map the insights to the keyword entity format
      const mappedKeywords: Omit<
        Keyword,
        'id' | 'created_at' | 'updated_at'
      >[] = keywordInsights.map((keyword) => ({
        keyword: keyword.keyword.toLowerCase(),
        search_volume: keyword?.search_volume,
        cpc: keyword?.cpc,
        competition: keyword?.competition,
        competition_index: keyword?.competition_index,
        low_top_of_page_bid: keyword?.low_top_of_page_bid,
        high_top_of_page_bid: keyword?.high_top_of_page_bid,
        contentCalendars: [],
      }));

      // Create new keywords in the database
      newKeywordObjects =
        await this.keywordRepository.createMultiple(mappedKeywords);

      return [...existingKeywords, ...newKeywordObjects];
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
