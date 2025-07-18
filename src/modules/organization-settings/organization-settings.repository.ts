import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationSettings } from './organization-settings.entity';

@Injectable()
export class OrganizationSettingsRepository {
  constructor(
    @InjectRepository(OrganizationSettings)
    private readonly organizationSettingsRepository: Repository<OrganizationSettings>,
  ) {}

  async create(
    data: Partial<OrganizationSettings>,
  ): Promise<OrganizationSettings> {
    const settings = this.organizationSettingsRepository.create(data);
    return this.organizationSettingsRepository.save(settings);
  }

  async findAll(): Promise<OrganizationSettings[]> {
    return this.organizationSettingsRepository.find({
      relations: ['organization'],
    });
  }

  async findById(id: number): Promise<OrganizationSettings | null> {
    return this.organizationSettingsRepository.findOne({
      where: { id },
      relations: ['organization'],
    });
  }

  async findByOrganizationId(
    organizationId: number,
  ): Promise<OrganizationSettings | null> {
    return this.organizationSettingsRepository.findOne({
      where: { organization_id: organizationId },
      relations: ['organization'],
    });
  }

  async update(
    id: number,
    data: Partial<OrganizationSettings>,
  ): Promise<OrganizationSettings> {
    await this.organizationSettingsRepository.update(id, data);
    const result = await this.organizationSettingsRepository.findOne({
      where: { id },
      relations: ['organization'],
    });
    if (!result) {
      throw new Error(`Organization settings with id ${id} not found`);
    }
    return result;
  }

  async delete(id: number): Promise<void> {
    await this.organizationSettingsRepository.delete(id);
  }
}
