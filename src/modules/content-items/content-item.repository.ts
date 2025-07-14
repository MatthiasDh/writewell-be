import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { DataSource, Between } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '../../common/base.repository';
import { ContentItem, ContentType } from '../../entities/content-item.entity';
import { ContentCalendar } from '../content-calendar/content-calendar.entity';
import { CreateContentItemDto } from './dto/create-content-item.dto';
import { UpdateContentItemDto } from './dto/update-content-item.dto';

@Injectable()
export class ContentItemRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async create(
    createContentItemDto: CreateContentItemDto,
    contentCalendar: ContentCalendar,
  ): Promise<ContentItem> {
    const repository = this.getRepository(ContentItem);
    const contentItem = repository.create({
      type: createContentItemDto.type,
      title: createContentItemDto.title,
      content: createContentItemDto.content,
      publishDate: createContentItemDto.publishDate,
      isPublished: createContentItemDto.isPublished || false,
      contentCalendar,
    });

    return repository.save(contentItem);
  }

  async createContentItems(
    contentItems: Partial<ContentItem>[],
  ): Promise<ContentItem[]> {
    const repository = this.getRepository(ContentItem);
    const createdItems = repository.create(contentItems);
    return repository.save(createdItems);
  }

  async findAll(): Promise<ContentItem[]> {
    const repository = this.getRepository(ContentItem);
    return repository.find({
      relations: ['contentCalendar', 'contentCalendar.organization'],
      order: { publishDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ContentItem | null> {
    const repository = this.getRepository(ContentItem);
    return repository.findOne({
      where: { id },
      relations: ['contentCalendar', 'contentCalendar.organization'],
    });
  }

  async findByCalendar(calendarId: string): Promise<ContentItem[]> {
    const repository = this.getRepository(ContentItem);
    return repository.find({
      where: { contentCalendar: { id: calendarId } },
      relations: ['contentCalendar', 'contentCalendar.organization'],
      order: { publishDate: 'DESC' },
    });
  }

  async findByType(type: ContentType): Promise<ContentItem[]> {
    const repository = this.getRepository(ContentItem);
    return repository.find({
      where: { type },
      relations: ['contentCalendar', 'contentCalendar.organization'],
      order: { publishDate: 'DESC' },
    });
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ContentItem[]> {
    const repository = this.getRepository(ContentItem);
    return repository.find({
      where: {
        publishDate: Between(startDate, endDate),
      },
      relations: ['contentCalendar', 'contentCalendar.organization'],
      order: { publishDate: 'ASC' },
    });
  }

  async findByAccount(accountId: string): Promise<ContentItem[]> {
    const repository = this.getRepository(ContentItem);
    return repository.find({
      where: {
        contentCalendar: {
          organizationId: accountId,
        },
      },
      relations: ['contentCalendar'],
      order: { publishDate: 'DESC' },
    });
  }

  async update(
    id: string,
    updateContentItemDto: UpdateContentItemDto,
  ): Promise<ContentItem> {
    const repository = this.getRepository(ContentItem);
    await repository.update(id, updateContentItemDto);
    const result = await this.findOne(id);
    if (!result) {
      throw new Error('ContentItem not found after update');
    }
    return result;
  }

  async remove(id: string): Promise<void> {
    const repository = this.getRepository(ContentItem);
    await repository.delete(id);
  }

  async publish(id: string): Promise<ContentItem> {
    const repository = this.getRepository(ContentItem);
    await repository.update(id, { isPublished: true });
    const result = await this.findOne(id);
    if (!result) {
      throw new Error('ContentItem not found after publish');
    }
    return result;
  }

  async unpublish(id: string): Promise<ContentItem> {
    const repository = this.getRepository(ContentItem);
    await repository.update(id, { isPublished: false });
    const result = await this.findOne(id);
    if (!result) {
      throw new Error('ContentItem not found after unpublish');
    }
    return result;
  }

  async findPublished(): Promise<ContentItem[]> {
    const repository = this.getRepository(ContentItem);
    return repository.find({
      where: { isPublished: true },
      relations: ['contentCalendar', 'contentCalendar.organization'],
      order: { publishDate: 'DESC' },
    });
  }

  async findDrafts(): Promise<ContentItem[]> {
    const repository = this.getRepository(ContentItem);
    return repository.find({
      where: { isPublished: false },
      relations: ['contentCalendar', 'contentCalendar.organization'],
      order: { publishDate: 'DESC' },
    });
  }
}
