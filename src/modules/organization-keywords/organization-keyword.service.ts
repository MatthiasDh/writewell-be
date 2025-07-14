import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrganizationKeywordRepository } from './organization-keyword.repository';
import { KeywordService } from '../keywords/keywords.service';
import { OpenAIService } from '../../common/services/openai.service';
import { DataForSEOService } from '../../common/services/dataforseo.service';
import { Keyword } from '../keywords/keyword.entity';
import { KeywordRepository } from '../keywords/keywords.repository';

@Injectable()
export class OrganizationKeywordService {
  constructor(
    private readonly organizationKeywordRepository: OrganizationKeywordRepository,
    private readonly keywordRepository: KeywordRepository,
    private readonly dataForSEOService: DataForSEOService,
    private readonly openaiService: OpenAIService,
  ) {}

  async addKeywordsToOrganization(
    organizationId: string,
    keywordIds: string[],
  ): Promise<void> {
    keywordIds.forEach(async (keywordId) => {
      await this.organizationKeywordRepository.create(
        organizationId,
        keywordId,
      );
    });

    return;
  }

  async getKeywordsForOrganizationBasedOnDescription(
    organizationDescription: string,
  ): Promise<Keyword[]> {
    try {
      // Get relevant keywords from the business context
      const businessRelevantKeywords =
        await this.openaiService.getRelevantKeywordsFromBusinessContext(
          organizationDescription,
        );

      // Convert keywords to lowercase for case-insensitive comparison
      const lowercaseKeywords = businessRelevantKeywords.keywords.map((k) =>
        k.toLowerCase(),
      );

      // Check if the keywords already exist in the database (case-insensitive)
      const existingKeywords =
        await this.keywordRepository.findMultiple(lowercaseKeywords);

      // Create a set of existing keyword strings for easy lookup
      const existingKeywordStrings = new Set(
        existingKeywords.map((k) => k.keyword.toLowerCase()),
      );

      // Find keywords that don't exist in the database
      const newKeywords = lowercaseKeywords.filter(
        (keyword) => !existingKeywordStrings.has(keyword),
      );

      let newKeywordObjects: Keyword[] = [];

      // If there are new keywords, fetch insights and create them
      if (newKeywords.length > 0) {
        const keywordInsights =
          await this.dataForSEOService.getKeywordsInsights(newKeywords);

        // Map the insights to the keyword entity format
        const mappedKeywords: Omit<
          Keyword,
          'id' | 'created_at' | 'updated_at'
        >[] = keywordInsights.map((keyword) => ({
          keyword: keyword.keyword.toLowerCase(),
          search_volume: keyword.search_volume,
          cpc: keyword.cpc,
          competition: keyword.competition,
          competition_index: keyword.competition_index,
          low_top_of_page_bid: keyword.low_top_of_page_bid,
          high_top_of_page_bid: keyword.high_top_of_page_bid,
          contentCalendars: [],
          orgRelations: [],
        }));

        // Create new keywords in the database
        newKeywordObjects =
          await this.keywordRepository.createMultiple(mappedKeywords);
      }

      // Combine existing keywords with newly created ones
      return [...existingKeywords, ...newKeywordObjects];
    } catch (error) {
      throw new HttpException(
        'Failed to fetch keywords',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
