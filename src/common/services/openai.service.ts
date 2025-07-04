import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import OpenAI from 'openai';

import {
  BUSINESS_RELEVANT_KEYWORDS_MOCKUP,
  BUSINESS_SUMMARY_MOCKUP,
} from '../mockup/business-summary.mockup';
import {
  BUSINESS_SUMMARY_PROMPT,
  BUSINESS_RELEVANT_KEYWORDS_PROMPT,
} from '../prompts/openai.prompt';

type BusinessSummary = {
  title: string;
  summary: string;
};

type BusinessRelevantKeywords = {
  keywords: string[];
};

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getSummaryFromBusinessContext(
    textContent: string,
  ): Promise<BusinessSummary> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return BUSINESS_SUMMARY_MOCKUP;
      }

      const completion = await this.openai.chat.completions.create({
        model: 'o4-mini-2025-04-16',
        messages: [
          {
            role: 'system',
            content: BUSINESS_SUMMARY_PROMPT,
          },
          {
            role: 'user',
            content: `Please summarize the following website content: ${textContent}`,
          },
        ],
      });

      const response = JSON.parse(
        completion.choices[0]?.message?.content ||
          '{"title": "title", "summary": "summary"}',
      ) as BusinessSummary;

      return {
        title: response.title,
        summary: response.summary,
      };
    } catch {
      throw new HttpException(
        'Failed to generate summary',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRelevantKeywordsFromBusinessContext(
    context: string,
  ): Promise<BusinessRelevantKeywords> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return BUSINESS_RELEVANT_KEYWORDS_MOCKUP;
      }

      const completion = await this.openai.chat.completions.create({
        model: 'o4-mini-2025-04-16',
        messages: [
          {
            role: 'system',
            content: BUSINESS_RELEVANT_KEYWORDS_PROMPT,
          },
          {
            role: 'user',
            content: `Please summarize the following website content: ${context}`,
          },
        ],
      });

      const response = JSON.parse(
        completion.choices[0]?.message?.content ||
          '{"keywords": ["keyword1", "keyword2", "keyword3"]}',
      ) as BusinessRelevantKeywords;

      return {
        keywords: response.keywords,
      };
    } catch {
      throw new HttpException(
        'Failed to generate keywords',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
