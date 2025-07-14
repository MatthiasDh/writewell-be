import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { KEYWORDS_RESPONSE_MOCKUP } from '../mockup/keywords-response.mockup';

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

@Injectable()
export class DataForSEOService {
  private readonly baseUrl = 'https://api.dataforseo.com';

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

  async getKeywordsInsights(keywords: string[]): Promise<KeywordData[]> {
    try {
      if (keywords.length === 0) {
        throw new HttpException(
          'No relevant keywords found in the provided text',
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.fetchKeywordData(keywords, 2840, 'en', 'relevance');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to get relevant keywords from DataForSEO API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* 
    Contact DataForSEO API to get keyword search volume data
  */
  private async fetchKeywordData(
    keywords: string[],
    locationCode: number,
    languageCode: string,
    sortBy: string,
  ): Promise<KeywordData[]> {
    const requestData: DataForSEORequest[] = [
      {
        keywords: keywords,
        sort_by: sortBy,
      },
    ];

    try {
      // if (process.env.NODE_ENV === 'development') {
      //   return Promise.resolve(
      //     KEYWORDS_RESPONSE_MOCKUP.keywords as KeywordData[],
      //   );
      // }

      const response = await axios.post<DataForSEOResponse>(
        `${this.baseUrl}/v3/keywords_data/google_ads/search_volume/live`,
        requestData,
        {
          headers: {
            Authorization: this.authHeader,
            'Content-Type': 'application/json',
          },
        },
      );

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
      console.log(error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
        throw new Error(`DataForSEO API request failed: ${error.message}`);
      }
      throw error;
    }
  }
}
