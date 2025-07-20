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

  async findByOrganizationId(
    organizationId: string,
  ): Promise<OrganizationSettings | null> {
    return this.organizationSettingsRepository.findByOrganizationId(
      organizationId,
    );
  }

  async update(
    id: string,
    data: UpdateOrganizationSettingsDto,
  ): Promise<OrganizationSettings> {
    return this.organizationSettingsRepository.update(id, data);
  }
}
