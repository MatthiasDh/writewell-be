import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { isDevelopment } from '../../utils/node.utils';

type KeywordData = {
  keyword: string;
  search_volume: number;
  cpc: number;
  competition: 'LOW' | 'MEDIUM' | 'HIGH';
  competition_index: number;
  low_top_of_page_bid: number;
  high_top_of_page_bid: number;
};

type DataForSEORequest = {
  keywords: string[];
  sort_by?: string;
  location_code?: number;
  language_code?: string;
};

type DataForSEOResponse = {
  status_code: number;
  status_message: string;
  tasks: Array<{
    id: string;
    status_code: number;
    status_message: string;
    result: Array<{
      keyword: string;
      search_volume: number;
      cpc: number;
      competition: 'LOW' | 'MEDIUM' | 'HIGH';
      competition_index: number;
      low_top_of_page_bid: number;
      high_top_of_page_bid: number;
    }>;
  }>;
};

type KeywordResponse = {
  keywords: KeywordData[];
  totalCount: number;
};

const EXAMPLE_RESPONSE: KeywordResponse = {
  keywords: [
    {
      keyword: 'software',
      search_volume: 368000,
      cpc: 3.99,
      competition: 'LOW',
      competition_index: 8,
      low_top_of_page_bid: 1.06,
      high_top_of_page_bid: 5.36,
    },
    {
      keyword: 'developer',
      search_volume: 33100,
      cpc: 11.31,
      competition: 'LOW',
      competition_index: 9,
      low_top_of_page_bid: 2.38,
      high_top_of_page_bid: 11.55,
    },
    {
      keyword: 'react',
      search_volume: 60500,
      cpc: 7.22,
      competition: 'LOW',
      competition_index: 1,
      low_top_of_page_bid: 1.85,
      high_top_of_page_bid: 6.23,
    },
    {
      keyword: 'native',
      search_volume: 110000,
      cpc: 1.26,
      competition: 'HIGH',
      competition_index: 100,
      low_top_of_page_bid: 0.28,
      high_top_of_page_bid: 1.89,
    },
  ],
  totalCount: 4,
};

@Injectable()
export class DataForSEOService {
  private readonly baseUrl =
    'https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live';
  private readonly authHeader: string;

  constructor() {
    const username = process.env.DATAFORSEO_USERNAME;
    const password = process.env.DATAFORSEO_PASSWORD;

    if (!username || !password) {
      throw new Error(
        'DATAFORSEO_USERNAME and DATAFORSEO_PASSWORD environment variables are required',
      );
    }

    // Create Basic Auth header
    const credentials = Buffer.from(`${username}:${password}`).toString(
      'base64',
    );
    this.authHeader = `Basic ${credentials}`;
  }

  async getKeywordSearchVolume(
    keywords: string[],
    locationCode: number = 2840, // US by default
    languageCode: string = 'en',
    sortBy: string = 'relevance',
  ): Promise<KeywordResponse> {
    try {
      if (!keywords || keywords.length === 0) {
        throw new HttpException(
          'Keywords array cannot be empty',
          HttpStatus.BAD_REQUEST,
        );
      }

      // DataForSEO has a limit of 100 keywords per request
      const maxKeywordsPerRequest = 100;
      const allKeywords: KeywordData[] = [];

      // Process keywords in batches
      for (let i = 0; i < keywords.length; i += maxKeywordsPerRequest) {
        const batch = keywords.slice(i, i + maxKeywordsPerRequest);
        const batchResults = await this.fetchKeywordData(
          batch,
          locationCode,
          languageCode,
          sortBy,
        );
        allKeywords.push(...batchResults);
      }

      return {
        keywords: allKeywords,
        totalCount: allKeywords.length,
      };
    } catch (error) {
      console.error('Error fetching keyword data from DataForSEO:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to fetch keyword data from DataForSEO API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRelevantKeywords(text: string): Promise<KeywordResponse> {
    try {
      // Extract seed keywords from the text
      const seedKeywords = this.extractSeedKeywords(text);

      if (seedKeywords.length === 0) {
        throw new HttpException(
          'No relevant keywords found in the provided text',
          HttpStatus.BAD_REQUEST,
        );
      }

      return Promise.resolve(EXAMPLE_RESPONSE);
      // Get search volume data for the extracted keywords
      return await this.getKeywordSearchVolume(seedKeywords);
    } catch (error) {
      console.error('Error getting relevant keywords:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to get relevant keywords from DataForSEO API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async fetchKeywordData(
    keywords: string[],
    locationCode: number,
    languageCode: string,
    sortBy: string,
  ): Promise<KeywordData[]> {
    const requestData: DataForSEORequest[] = [
      {
        keywords,
        sort_by: sortBy,
        location_code: locationCode,
        language_code: languageCode,
      },
    ];

    try {
      if (isDevelopment) {
        return Promise.resolve(EXAMPLE_RESPONSE.keywords);
      }

      const response = await axios.post<DataForSEOResponse>(
        this.baseUrl,
        requestData,
        {
          headers: {
            Authorization: this.authHeader,
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 second timeout
        },
      );

      if (response.data.status_code !== 20000) {
        throw new Error(
          `DataForSEO API error: ${response.data.status_message}`,
        );
      }

      if (!response.data.tasks || response.data.tasks.length === 0) {
        throw new Error('No tasks returned from DataForSEO API');
      }

      const task = response.data.tasks[0];

      if (task.status_code !== 20000) {
        throw new Error(`Task error: ${task.status_message}`);
      }

      if (!task.result || task.result.length === 0) {
        return [];
      }

      return task.result.map((item) => ({
        keyword: item.keyword,
        search_volume: item.search_volume,
        cpc: item.cpc,
        competition: item.competition,
        competition_index: item.competition_index,
        low_top_of_page_bid: item.low_top_of_page_bid,
        high_top_of_page_bid: item.high_top_of_page_bid,
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
        throw new Error(`DataForSEO API request failed: ${error.message}`);
      }
      throw error;
    }
  }

  private extractSeedKeywords(text: string): string[] {
    // Simple keyword extraction - can be enhanced with NLP libraries
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 3) // Filter out short words
      .filter((word) => !this.isCommonWord(word)); // Filter out common words

    // Return unique words, limited to first 20
    return [...new Set(words)].slice(0, 20);
  }

  private isCommonWord(word: string): boolean {
    const commonWords = [
      'the',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'from',
      'up',
      'about',
      'into',
      'through',
      'during',
      'before',
      'after',
      'above',
      'below',
      'between',
      'among',
      'within',
      'without',
      'this',
      'that',
      'these',
      'those',
      'is',
      'are',
      'was',
      'were',
      'be',
      'been',
      'being',
      'have',
      'has',
      'had',
      'do',
      'does',
      'did',
      'will',
      'would',
      'could',
      'should',
      'may',
      'might',
      'can',
      'must',
      'shall',
      'a',
      'an',
      'as',
      'if',
      'then',
      'else',
      'when',
      'at',
      'from',
      'till',
      'until',
      'against',
      'over',
      'under',
      'again',
      'further',
      'then',
      'once',
      'here',
      'there',
      'when',
      'where',
      'why',
      'how',
      'all',
      'any',
      'both',
      'each',
      'few',
      'more',
      'most',
      'other',
      'some',
      'such',
      'no',
      'nor',
      'not',
      'only',
      'own',
      'same',
      'so',
      'than',
      'too',
      'very',
      's',
      't',
      'can',
      'will',
      'just',
      'don',
      'should',
      'now',
      'd',
      'll',
      'm',
      'o',
      're',
      've',
      'y',
      'ain',
      'aren',
      'couldn',
      'didn',
      'doesn',
      'hadn',
      'hasn',
      'haven',
      'isn',
      'ma',
      'mightn',
      'mustn',
      'needn',
      'shan',
      'shouldn',
      'wasn',
      'weren',
      'won',
      'wouldn',
    ];
    return commonWords.includes(word);
  }

  // Method to get keyword suggestions based on a seed keyword
  async getKeywordSuggestions(
    seedKeyword: string,
    locationCode: number = 2840,
    languageCode: string = 'en',
  ): Promise<KeywordResponse> {
    try {
      // For now, we'll use the same keyword as a suggestion
      // In a real implementation, you might want to use DataForSEO's keyword suggestions endpoint
      const keywords = [seedKeyword];

      return await this.getKeywordSearchVolume(
        keywords,
        locationCode,
        languageCode,
      );
    } catch (error) {
      console.error('Error getting keyword suggestions:', error);
      throw new HttpException(
        'Failed to get keyword suggestions from DataForSEO API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
