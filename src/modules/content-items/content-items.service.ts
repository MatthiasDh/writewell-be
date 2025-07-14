import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ContentItem, ContentType } from '../../entities/content-item.entity';
import { CreateContentItemDto } from './dto/create-content-item.dto';
import { UpdateContentItemDto } from './dto/update-content-item.dto';
import { ContentItemRepository } from './content-item.repository';
import { ContentCalendarRepository } from '../content-calendar/content-calendar.repository';

@Injectable()
export class ContentItemsService {
  constructor(
    private readonly contentItemRepository: ContentItemRepository,
    private readonly contentCalendarRepository: ContentCalendarRepository,
  ) {}

  async create(
    createContentItemDto: CreateContentItemDto,
  ): Promise<ContentItem> {
    try {
      const contentCalendar = await this.contentCalendarRepository.findOne(
        createContentItemDto.contentCalendarId,
      );

      if (!contentCalendar) {
        throw new HttpException(
          'Content calendar not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const savedItem = await this.contentItemRepository.create(
        createContentItemDto,
        contentCalendar,
      );
      return this.findOne(savedItem.id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create content item',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<ContentItem[]> {
    return this.contentItemRepository.findAll();
  }

  async findOne(id: string): Promise<ContentItem> {
    const contentItem = await this.contentItemRepository.findOne(id);

    if (!contentItem) {
      throw new HttpException('Content item not found', HttpStatus.NOT_FOUND);
    }

    return contentItem;
  }

  async findByCalendar(calendarId: string): Promise<ContentItem[]> {
    return this.contentItemRepository.findByCalendar(calendarId);
  }

  async findByType(type: ContentType): Promise<ContentItem[]> {
    return this.contentItemRepository.findByType(type);
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ContentItem[]> {
    return this.contentItemRepository.findByDateRange(startDate, endDate);
  }

  async findByAccount(accountId: string): Promise<ContentItem[]> {
    return this.contentItemRepository.findByAccount(accountId);
  }

  async update(
    id: string,
    updateContentItemDto: UpdateContentItemDto,
  ): Promise<ContentItem> {
    await this.findOne(id);
    return this.contentItemRepository.update(id, updateContentItemDto);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.contentItemRepository.remove(id);
  }

  async publish(id: string): Promise<ContentItem> {
    await this.findOne(id);
    return this.contentItemRepository.publish(id);
  }

  async unpublish(id: string): Promise<ContentItem> {
    await this.findOne(id);
    return this.contentItemRepository.unpublish(id);
  }

  async findPublished(): Promise<ContentItem[]> {
    return this.contentItemRepository.findPublished();
  }

  async findDrafts(): Promise<ContentItem[]> {
    return this.contentItemRepository.findDrafts();
  }

  async createContentItems(
    contentItems: Partial<ContentItem>[],
  ): Promise<ContentItem[]> {
    return this.contentItemRepository.createContentItems(contentItems);
  }
}
