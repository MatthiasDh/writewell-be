import { Injectable } from '@nestjs/common';
import { OrganizationSettingsRepository } from './organization-settings.repository';
import { OrganizationSettings } from './organization-settings.entity';
import {
  CreateOrganizationSettingsDto,
  UpdateOrganizationSettingsDto,
} from './dto';

@Injectable()
export class OrganizationSettingsService {
  constructor(
    private readonly organizationSettingsRepository: OrganizationSettingsRepository,
  ) {}

  async create(
    data: CreateOrganizationSettingsDto,
  ): Promise<OrganizationSettings> {
    return this.organizationSettingsRepository.create(data);
  }

  async findAll(): Promise<OrganizationSettings[]> {
    return this.organizationSettingsRepository.findAll();
  }

  async findOne(id: number): Promise<OrganizationSettings | null> {
    return this.organizationSettingsRepository.findById(id);
  }

  async findByOrganizationId(
    organizationId: number,
  ): Promise<OrganizationSettings | null> {
    return this.organizationSettingsRepository.findByOrganizationId(
      organizationId,
    );
  }

  async update(
    id: number,
    data: UpdateOrganizationSettingsDto,
  ): Promise<OrganizationSettings> {
    return this.organizationSettingsRepository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    return this.organizationSettingsRepository.delete(id);
  }
}
