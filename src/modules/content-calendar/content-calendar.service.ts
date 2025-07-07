import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentCalendar } from '../../entities/content-calendar.entity';
import { Tenant } from '../../entities/tenant.entity';
import { UpdateContentCalendarDto } from './dto/update-content-calendar.dto';
import { ContentItem } from '../../entities/content-item.entity';

@Injectable()
export class ContentCalendarService {
  constructor(
    @InjectRepository(ContentCalendar)
    private readonly contentCalendarRepository: Repository<ContentCalendar>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(ContentItem)
    private readonly contentItemRepository: Repository<ContentItem>,
  ) {}

  async findAll(): Promise<ContentCalendar[]> {
    return this.contentCalendarRepository.find({
      relations: ['tenant', 'contentItems'],
    });
  }

  async findOne(id: string): Promise<ContentCalendar> {
    const contentCalendar = await this.contentCalendarRepository.findOne({
      where: { id },
      relations: ['tenant', 'contentItems'],
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
      where: { tenant: { id: accountId } },
      relations: ['tenant', 'contentItems'],
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
        tenant: {
          users: {
            id: userId,
          },
        },
      },
      relations: ['tenant', 'contentItems'],
    });
  }

  async createContentItems(
    contentItems: Partial<ContentItem>[],
  ): Promise<ContentItem[]> {
    const createdItems = this.contentItemRepository.create(contentItems);

    return this.contentItemRepository.save(createdItems);
  }
}
