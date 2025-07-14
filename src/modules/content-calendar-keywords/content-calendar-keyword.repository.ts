import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '../../common/base.repository';
import { ContentCalendarKeyword } from './content-calendar-keyword.entity';
import { Keyword } from '../keywords/keyword.entity';
import { ContentCalendar } from '../content-calendar/content-calendar.entity';

@Injectable()
export class ContentCalendarKeywordRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async create(
    contentCalendarId: string,
    keywordId: string,
  ): Promise<ContentCalendarKeyword> {
    const repository = this.getRepository(ContentCalendarKeyword);
    const contentCalendarKeyword = repository.create({
      contentCalendar: { id: contentCalendarId },
      keyword: { id: keywordId },
      created_at: new Date(),
      updated_at: new Date(),
    });

    return repository.save(contentCalendarKeyword);
  }

  async createMultiple(
    contentCalendarId: string,
    keywords: Keyword[],
  ): Promise<ContentCalendarKeyword[]> {
    const repository = this.getRepository(ContentCalendarKeyword);
    const contentCalendarKeywords = repository.create(
      keywords.map((keyword) => ({
        contentCalendar: { id: contentCalendarId },
        keyword,
        created_at: new Date(),
        updated_at: new Date(),
      })),
    );

    return repository.save(contentCalendarKeywords);
  }

  async findByContentCalendar(
    contentCalendarId: string,
  ): Promise<ContentCalendarKeyword[]> {
    const repository = this.getRepository(ContentCalendarKeyword);
    return repository.find({
      where: { contentCalendar: { id: contentCalendarId } },
      relations: ['keyword'],
      order: { created_at: 'DESC' },
    });
  }

  async findByKeyword(keywordId: string): Promise<ContentCalendarKeyword[]> {
    const repository = this.getRepository(ContentCalendarKeyword);
    return repository.find({
      where: { keyword: { id: keywordId } },
      relations: ['contentCalendar'],
      order: { created_at: 'DESC' },
    });
  }

  async findByContentCalendarAndKeyword(
    contentCalendarId: string,
    keywordId: string,
  ): Promise<ContentCalendarKeyword | null> {
    const repository = this.getRepository(ContentCalendarKeyword);
    return repository.findOne({
      where: {
        contentCalendar: { id: contentCalendarId },
        keyword: { id: keywordId },
      },
      relations: ['keyword'],
    });
  }

  async remove(id: string): Promise<void> {
    const repository = this.getRepository(ContentCalendarKeyword);
    await repository.delete(id);
  }

  async removeByContentCalendarAndKeyword(
    contentCalendarId: string,
    keywordId: string,
  ): Promise<void> {
    const repository = this.getRepository(ContentCalendarKeyword);
    await repository.delete({
      contentCalendar: { id: contentCalendarId },
      keyword: { id: keywordId },
    });
  }

  async removeAllByContentCalendar(contentCalendarId: string): Promise<void> {
    const repository = this.getRepository(ContentCalendarKeyword);
    await repository.delete({ contentCalendar: { id: contentCalendarId } });
  }

  async removeAllByKeyword(keywordId: string): Promise<void> {
    const repository = this.getRepository(ContentCalendarKeyword);
    await repository.delete({ keyword: { id: keywordId } });
  }

  async bulkCreate(
    contentCalendarKeywords: Array<{
      contentCalendarId: string;
      keywordId: string;
    }>,
  ): Promise<ContentCalendarKeyword[]> {
    const repository = this.getRepository(ContentCalendarKeyword);
    const keywordRepository = this.getRepository(Keyword);
    const contentCalendarRepository = this.getRepository(ContentCalendar);

    const entities: ContentCalendarKeyword[] = [];
    for (const ccKeyword of contentCalendarKeywords) {
      const [keyword, contentCalendar] = await Promise.all([
        keywordRepository.findOne({
          where: { id: ccKeyword.keywordId },
        }),
        contentCalendarRepository.findOne({
          where: { id: ccKeyword.contentCalendarId },
        }),
      ]);

      if (keyword && contentCalendar) {
        entities.push(
          repository.create({
            contentCalendar,
            keyword,
          }),
        );
      }
    }

    return repository.save(entities);
  }

  async getKeywordCountByContentCalendar(
    contentCalendarId: string,
  ): Promise<number> {
    const repository = this.getRepository(ContentCalendarKeyword);
    return repository.count({
      where: { contentCalendar: { id: contentCalendarId } },
    });
  }
}
