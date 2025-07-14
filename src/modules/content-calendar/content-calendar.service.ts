import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ContentCalendar } from './content-calendar.entity';
import { UpdateContentCalendarDto } from './dto/update-content-calendar.dto';
import { ContentItem } from '../../entities/content-item.entity';
import { ContentCalendarRepository } from './content-calendar.repository';

@Injectable()
export class ContentCalendarService {
  constructor(
    private readonly contentCalendarRepository: ContentCalendarRepository,
  ) {}

  async create(organizationId: string): Promise<ContentCalendar> {
    return this.contentCalendarRepository.create(organizationId);
  }

  async findAll(organizationId: string): Promise<ContentCalendar[]> {
    return this.contentCalendarRepository.findAll(organizationId);
  }

  async findOne(id: string): Promise<ContentCalendar> {
    const contentCalendar = await this.contentCalendarRepository.findOne(id);

    if (!contentCalendar) {
      throw new HttpException(
        'Content calendar not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return contentCalendar;
  }

  async findByAccount(accountId: string): Promise<ContentCalendar | null> {
    return this.contentCalendarRepository.findByAccount(accountId);
  }

  async update(
    id: string,
    updateContentCalendarDto: UpdateContentCalendarDto,
  ): Promise<ContentCalendar> {
    const contentCalendar = await this.findOne(id);
    return this.contentCalendarRepository.update(id, updateContentCalendarDto);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.contentCalendarRepository.remove(id);
  }

  async createContentItems(
    contentItems: Partial<ContentItem>[],
  ): Promise<ContentItem[]> {
    // This method should be moved to ContentItemsService
    // For now, we'll delegate to the repository
    throw new HttpException(
      'This method should be called through ContentItemsService',
      HttpStatus.BAD_REQUEST,
    );
  }

  async findContentItemsByDateRange(
    organizationId: string,
  ): Promise<ContentItem[]> {
    return this.contentCalendarRepository.findContentItemsByDateRange(
      organizationId,
    );
  }
}
