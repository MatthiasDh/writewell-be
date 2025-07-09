import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ContentCalendar } from '../../entities/content-calendar.entity';
import { UpdateContentCalendarDto } from './dto/update-content-calendar.dto';
import { ContentItem } from '../../entities/content-item.entity';

@Injectable()
export class ContentCalendarService {
  constructor(
    @InjectRepository(ContentCalendar)
    private readonly contentCalendarRepository: Repository<ContentCalendar>,
    @InjectRepository(ContentItem)
    private readonly contentItemRepository: Repository<ContentItem>,
  ) {}

  async findAll(organizationId: string): Promise<ContentCalendar[]> {
    return this.contentCalendarRepository.find({
      where: { organization: { id: organizationId } },
      relations: ['organization', 'contentItems'],
    });
  }

  async findOne(id: string): Promise<ContentCalendar> {
    const contentCalendar = await this.contentCalendarRepository.findOne({
      where: { organization: { id } },
      relations: ['organization', 'contentItems'],
    });

    if (!contentCalendar) {
      throw new HttpException(
        'Content calendar not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return contentCalendar;
  }

  async findByAccount(accountId: string): Promise<ContentCalendar | null> {
    return this.contentCalendarRepository.findOne({
      where: { organization: { id: accountId } },
      relations: ['organization', 'contentItems'],
    });
  }

  async update(
    id: string,
    updateContentCalendarDto: UpdateContentCalendarDto,
  ): Promise<ContentCalendar> {
    const contentCalendar = await this.findOne(id);

    Object.assign(contentCalendar, updateContentCalendarDto);
    await this.contentCalendarRepository.save(contentCalendar);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const contentCalendar = await this.findOne(id);
    await this.contentCalendarRepository.remove(contentCalendar);
  }

  async findByUser(userId: string): Promise<ContentCalendar[]> {
    return this.contentCalendarRepository.find({
      where: {
        organization: {
          users: {
            id: userId,
          },
        },
      },
      relations: ['organization', 'contentItems'],
    });
  }

  async createContentItems(
    contentItems: Partial<ContentItem>[],
  ): Promise<ContentItem[]> {
    const createdItems = this.contentItemRepository.create(contentItems);

    return this.contentItemRepository.save(createdItems);
  }

  async findContentItemsByDateRange(
    organizationId: string,
  ): Promise<ContentItem[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30); // 30 days from today

    return this.contentItemRepository.find({
      where: {
        contentCalendar: {
          organization: { id: organizationId },
        },
        publishDate: Between(today, endDate),
      },
      relations: ['contentCalendar', 'contentCalendar.organization'],
      order: {
        publishDate: 'ASC',
      },
    });
  }
}
