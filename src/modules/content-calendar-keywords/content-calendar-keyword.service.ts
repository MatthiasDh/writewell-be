import { Injectable } from '@nestjs/common';
import { ContentCalendarKeywordRepository } from './content-calendar-keyword.repository';
import { Keyword } from '../keywords/keyword.entity';
import { ContentCalendarKeyword } from './content-calendar-keyword.entity';

@Injectable()
export class ContentCalendarKeywordService {
  constructor(
    private readonly contentCalendarKeywordRepository: ContentCalendarKeywordRepository,
  ) {}

  async addKeywordsToContentCalendar(
    contentCalendarId: string,
    keywordIds: string[],
  ): Promise<void> {
    const promises = keywordIds.map(async (keywordId) => {
      // Check if the relationship already exists
      const existingRelation =
        await this.contentCalendarKeywordRepository.findByContentCalendarAndKeyword(
          contentCalendarId,
          keywordId,
        );

      if (!existingRelation) {
        await this.contentCalendarKeywordRepository.create(
          contentCalendarId,
          keywordId,
        );
      }
    });

    await Promise.all(promises);
  }

  async addKeywordObjectsToContentCalendar(
    contentCalendarId: string,
    keywords: Keyword[],
  ): Promise<ContentCalendarKeyword[]> {
    return this.contentCalendarKeywordRepository.createMultiple(
      contentCalendarId,
      keywords,
    );
  }

  async getKeywordsByContentCalendar(
    contentCalendarId: string,
  ): Promise<ContentCalendarKeyword[]> {
    return this.contentCalendarKeywordRepository.findByContentCalendar(
      contentCalendarId,
    );
  }

  async removeKeywordFromContentCalendar(
    contentCalendarId: string,
    keywordId: string,
  ): Promise<void> {
    await this.contentCalendarKeywordRepository.removeByContentCalendarAndKeyword(
      contentCalendarId,
      keywordId,
    );
  }

  async removeAllKeywordsFromContentCalendar(
    contentCalendarId: string,
  ): Promise<void> {
    await this.contentCalendarKeywordRepository.removeAllByContentCalendar(
      contentCalendarId,
    );
  }

  async getKeywordCountByContentCalendar(
    contentCalendarId: string,
  ): Promise<number> {
    return this.contentCalendarKeywordRepository.getKeywordCountByContentCalendar(
      contentCalendarId,
    );
  }
}
