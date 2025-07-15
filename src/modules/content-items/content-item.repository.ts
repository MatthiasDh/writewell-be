import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { DataSource, Between } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '../../common/base.repository';
import { ContentItem } from './content-item.entity';

@Injectable()
export class ContentItemRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async findAllByCalendarId(calendarId: string): Promise<ContentItem[]> {
    const repository = this.getRepository(ContentItem);
    return repository.find({
      where: { contentCalendar: { id: calendarId } },
      relations: ['contentCalendar'],
      order: { publishDate: 'DESC' },
    });
  }

  async createMultiple(contentItems: ContentItem[]): Promise<ContentItem[]> {
    const repository = this.getRepository(ContentItem);

    return repository.save(contentItems);
  }
}
