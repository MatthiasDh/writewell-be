import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ContentItem, ContentType } from '../../entities/content-item.entity';
import { ContentCalendar } from '../../entities/content-calendar.entity';
import { CreateContentItemDto } from './dto/create-content-item.dto';
import { UpdateContentItemDto } from './dto/update-content-item.dto';

@Injectable()
export class ContentItemsService {
  constructor(
    @InjectRepository(ContentItem)
    private readonly contentItemRepository: Repository<ContentItem>,
    @InjectRepository(ContentCalendar)
    private readonly contentCalendarRepository: Repository<ContentCalendar>,
  ) {}

  async create(
    createContentItemDto: CreateContentItemDto,
  ): Promise<ContentItem> {
    try {
      const contentCalendar = await this.contentCalendarRepository.findOne({
        where: { id: createContentItemDto.contentCalendarId },
      });

      if (!contentCalendar) {
        throw new HttpException(
          'Content calendar not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const contentItem = this.contentItemRepository.create({
        type: createContentItemDto.type,
        title: createContentItemDto.title,
        content: createContentItemDto.content,
        publishDate: createContentItemDto.publishDate,
        isPublished: createContentItemDto.isPublished || false,
        contentCalendar,
      });

      const savedItem = await this.contentItemRepository.save(contentItem);
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
    return this.contentItemRepository.find({
      relations: ['contentCalendar', 'contentCalendar.tenant'],
      order: { publishDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ContentItem> {
    const contentItem = await this.contentItemRepository.findOne({
      where: { id },
      relations: ['contentCalendar', 'contentCalendar.tenant'],
    });

    if (!contentItem) {
      throw new HttpException('Content item not found', HttpStatus.NOT_FOUND);
    }

    return contentItem;
  }

  async findByCalendar(calendarId: string): Promise<ContentItem[]> {
    return this.contentItemRepository.find({
      where: { contentCalendar: { id: calendarId } },
      relations: ['contentCalendar', 'contentCalendar.tenant'],
      order: { publishDate: 'DESC' },
    });
  }

  async findByType(type: ContentType): Promise<ContentItem[]> {
    return this.contentItemRepository.find({
      where: { type },
      relations: ['contentCalendar', 'contentCalendar.tenant'],
      order: { publishDate: 'DESC' },
    });
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ContentItem[]> {
    return this.contentItemRepository.find({
      where: {
        publishDate: Between(startDate, endDate),
      },
      relations: ['contentCalendar', 'contentCalendar.account'],
      order: { publishDate: 'ASC' },
    });
  }

  async findByAccount(accountId: string): Promise<ContentItem[]> {
    return this.contentItemRepository.find({
      where: {
        contentCalendar: {
          tenant: {
            id: accountId,
          },
        },
      },
      relations: ['contentCalendar', 'contentCalendar.tenant'],
      order: { publishDate: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<ContentItem[]> {
    return this.contentItemRepository.find({
      where: {
        contentCalendar: {
          tenant: {
            users: {
              id: userId,
            },
          },
        },
      },
      relations: ['contentCalendar', 'contentCalendar.tenant'],
      order: { publishDate: 'DESC' },
    });
  }

  async update(
    id: string,
    updateContentItemDto: UpdateContentItemDto,
  ): Promise<ContentItem> {
    const contentItem = await this.findOne(id);

    Object.assign(contentItem, updateContentItemDto);
    await this.contentItemRepository.save(contentItem);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const contentItem = await this.findOne(id);
    await this.contentItemRepository.remove(contentItem);
  }

  async publish(id: string): Promise<ContentItem> {
    const contentItem = await this.findOne(id);
    contentItem.isPublished = true;
    await this.contentItemRepository.save(contentItem);
    return this.findOne(id);
  }

  async unpublish(id: string): Promise<ContentItem> {
    const contentItem = await this.findOne(id);
    contentItem.isPublished = false;
    await this.contentItemRepository.save(contentItem);
    return this.findOne(id);
  }

  async findPublished(): Promise<ContentItem[]> {
    return this.contentItemRepository.find({
      where: { isPublished: true },
      relations: ['contentCalendar', 'contentCalendar.tenant'],
      order: { publishDate: 'DESC' },
    });
  }

  async findDrafts(): Promise<ContentItem[]> {
    return this.contentItemRepository.find({
      where: { isPublished: false },
      relations: ['contentCalendar', 'contentCalendar.tenant'],
      order: { publishDate: 'DESC' },
    });
  }
}
