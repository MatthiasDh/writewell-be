import { Injectable } from '@nestjs/common';
import { ScheduledContentItemsRepository } from './scheduled-content-items.repository';
import { ScheduledContentItem } from './scheduled-content-item.entity';
import {
  CreateScheduledContentItemDto,
  UpdateScheduledContentItemDto,
} from './dto';

@Injectable()
export class ScheduledContentItemsService {
  constructor(
    private readonly scheduledContentItemsRepository: ScheduledContentItemsRepository,
  ) {}

  async create(
    data: CreateScheduledContentItemDto,
  ): Promise<ScheduledContentItem> {
    const processedData = {
      ...data,
      scheduled_date: new Date(data.scheduled_date),
    };
    return this.scheduledContentItemsRepository.create(processedData);
  }

  async findOne(id: string): Promise<ScheduledContentItem> {
    return this.scheduledContentItemsRepository.findById(id);
  }

  async findByOrganization(
    organizationId: string,
  ): Promise<ScheduledContentItem[]> {
    return this.scheduledContentItemsRepository.findByOrganization(
      organizationId,
    );
  }

  async update(
    id: string,
    data: UpdateScheduledContentItemDto,
  ): Promise<ScheduledContentItem> {
    const processedData = {
      ...data,
      scheduled_date: data.scheduled_date
        ? new Date(data.scheduled_date)
        : undefined,
    };
    return this.scheduledContentItemsRepository.update(id, processedData);
  }

  async remove(id: string): Promise<void> {
    return this.scheduledContentItemsRepository.delete(id);
  }
}
