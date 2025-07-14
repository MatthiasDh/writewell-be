import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { DataSource, Between } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '../../common/base.repository';
import { ContentCalendar } from './content-calendar.entity';
import { ContentItem } from '../../entities/content-item.entity';
import { UpdateContentCalendarDto } from './dto/update-content-calendar.dto';

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

  async findAll(organizationId: string): Promise<ContentCalendar[]> {
    const repository = this.getRepository(ContentCalendar);
    return repository.find({
      where: { organizationId: organizationId },
      relations: ['contentItems'],
    });
  }

  async findOne(id: string): Promise<ContentCalendar | null> {
    const repository = this.getRepository(ContentCalendar);
    return repository.findOne({
      where: { id },
      relations: ['contentItems'],
    });
  }

  async findByAccount(accountId: string): Promise<ContentCalendar | null> {
    const repository = this.getRepository(ContentCalendar);
    return repository.findOne({
      where: { organizationId: accountId },
      relations: ['contentItems'],
    });
  }

  async update(
    id: string,
    updateContentCalendarDto: UpdateContentCalendarDto,
  ): Promise<ContentCalendar> {
    const repository = this.getRepository(ContentCalendar);
    await repository.update(id, updateContentCalendarDto);
    const result = await this.findOne(id);
    if (!result) {
      throw new Error('ContentCalendar not found after update');
    }
    return result;
  }

  async remove(id: string): Promise<void> {
    const repository = this.getRepository(ContentCalendar);
    await repository.delete(id);
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
}
