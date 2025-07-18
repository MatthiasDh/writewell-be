import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduledContentItem } from './scheduled-content-item.entity';

@Injectable()
export class ScheduledContentItemsRepository {
  constructor(
    @InjectRepository(ScheduledContentItem)
    private readonly scheduledContentItemRepository: Repository<ScheduledContentItem>,
  ) {}

  async create(
    data: Partial<ScheduledContentItem>,
  ): Promise<ScheduledContentItem> {
    const scheduledContentItem =
      this.scheduledContentItemRepository.create(data);
    return this.scheduledContentItemRepository.save(scheduledContentItem);
  }

  async findById(id: number): Promise<ScheduledContentItem> {
    const result = await this.scheduledContentItemRepository.findOne({
      where: { id },
      relations: ['blog_post', 'organization'],
    });
    if (!result) {
      throw new Error(`Scheduled content item with id ${id} not found`);
    }
    return result;
  }

  async findByOrganization(
    organizationId: number,
  ): Promise<ScheduledContentItem[]> {
    return this.scheduledContentItemRepository.find({
      where: { organization_id: organizationId },
      relations: ['blog_post', 'organization'],
    });
  }

  async update(
    id: number,
    data: Partial<ScheduledContentItem>,
  ): Promise<ScheduledContentItem> {
    await this.scheduledContentItemRepository.update(id, data);
    const result = await this.scheduledContentItemRepository.findOne({
      where: { id },
      relations: ['blog_post', 'organization'],
    });
    if (!result) {
      throw new Error(`Scheduled content item with id ${id} not found`);
    }
    return result;
  }

  async delete(id: number): Promise<void> {
    await this.scheduledContentItemRepository.delete(id);
  }
}
