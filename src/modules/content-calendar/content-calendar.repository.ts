import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { DataSource, Between, In } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '../../common/base.repository';
import { ContentCalendar } from './content-calendar.entity';
import { ContentItem } from '../content-items/content-item.entity';
import { Keyword } from '../keywords/keyword.entity';

@Injectable()
export class ContentCalendarRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async create(organizationId: string): Promise<ContentCalendar> {
    const repository = this.getRepository(ContentCalendar);
    const contentCalendar = repository.create({
      organizationId,
      name: 'Default Calendar',
      description: 'Default content calendar for organization',
    });

    return repository.save(contentCalendar);
  }

  async addKeywords(
    contentCalendarId: string,
    keywordIds: string[],
  ): Promise<void> {
    try {
      const repository = this.getRepository(ContentCalendar);

      const calendar = await repository.findOne({
        where: { id: contentCalendarId },
        relations: ['keywords'],
      });

      if (!calendar) {
        throw new NotFoundException('Content calendar not found');
      }

      // Find the keywords to add
      const keywords = await this.getRepository(Keyword).find({
        where: { id: In(keywordIds) },
      });

      if (!keywords.length) {
        throw new NotFoundException('No keywords found');
      }

      calendar.keywords = [...calendar.keywords, ...keywords];

      await repository.save(calendar);

      return;
    } catch (e) {
      throw new HttpException('Something went wrong', HttpStatus.FORBIDDEN);
    }
  }

  async findOne(id: string): Promise<ContentCalendar | null> {
    const repository = this.getRepository(ContentCalendar);
    return repository.findOne({
      where: { id },
      relations: ['contentItems'],
    });
  }

  async findContentItemsByDateRange(
    organizationId: string,
  ): Promise<ContentItem[]> {
    const repository = this.getRepository(ContentItem);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30);

    return repository.find({
      where: {
        contentCalendar: {
          organizationId: organizationId,
        },
        publishDate: Between(today, endDate),
      },
      relations: ['contentCalendar'],
      order: {
        publishDate: 'ASC',
      },
    });
  }

  async findByIdAndOrg(
    calendarId: string,
    orgId: string,
  ): Promise<ContentCalendar | null> {
    const repository = this.getRepository(ContentCalendar);

    return repository.findOne({
      where: { id: calendarId, organizationId: orgId },
      relations: ['contentItems', 'keywords'],
    });
  }

  async findByOrgId(orgId: string): Promise<ContentCalendar | null> {
    const repository = this.getRepository(ContentCalendar);

    return repository.findOne({
      where: { organizationId: orgId },
      relations: ['contentItems', 'keywords'],
    });
  }

  async findById(calendarId: string): Promise<ContentCalendar | null> {
    const repository = this.getRepository(ContentCalendar);

    return repository.findOne({
      where: { id: calendarId },
      relations: ['contentItems', 'keywords'],
    });
  }
}
