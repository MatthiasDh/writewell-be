import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ContentCalendar } from './content-calendar.entity';
import { ContentItem } from '../content-items/content-item.entity';
import { ContentCalendarRepository } from './content-calendar.repository';
import { KeywordRepository } from '../keywords/keywords.repository';

@Injectable()
export class ContentCalendarService {
  constructor(
    private readonly contentCalendarRepository: ContentCalendarRepository,
  ) {}

  async addKeywords(
    contentCalendarId: string,
    keywordIds: string[],
  ): Promise<void> {
    await this.contentCalendarRepository.addKeywords(
      contentCalendarId,
      keywordIds,
    );
  }

  async create(organizationId: string): Promise<ContentCalendar> {
    return this.contentCalendarRepository.create(organizationId);
  }

  async findByOrgId(orgId: string): Promise<ContentCalendar | null> {
    return this.contentCalendarRepository.findByOrgId(orgId);
  }

  async findById(calendarId: string): Promise<ContentCalendar | null> {
    return this.contentCalendarRepository.findById(calendarId);
  }
}
