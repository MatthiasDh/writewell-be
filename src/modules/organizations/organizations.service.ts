import { Inject, Injectable } from '@nestjs/common';

import { ClerkClient } from '@clerk/backend';
import {
  CreateOrganizationParams,
  UpdateOrganizationParams,
} from './organizations.type';
import { LLMService } from '../../common/services/llm.service';
import { DataForSEOService } from '../../common/services/dataforseo.service';
import { OrganizationsRepository } from './organizations.repository';
import { Organization } from './organization.entity';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @Inject('ClerkClient')
    private readonly clerkClient: ClerkClient,
    private readonly organizationsRepository: OrganizationsRepository,
  ) {}

  // Clerk operations
  async getOrganization(organizationId: string) {
    return this.clerkClient.organizations.getOrganization({ organizationId });
  }

  async createOrganization(params: CreateOrganizationParams) {
    return this.clerkClient.organizations.createOrganization(params);
  }

  async updateOrganization(
    organizationId: string,
    params: UpdateOrganizationParams,
  ) {
    return this.clerkClient.organizations.updateOrganization(
      organizationId,
      params,
    );
  }

  async updateOrganizationDescription(
    organizationId: string,
    title: string,
    description: string,
  ) {
    return this.clerkClient.organizations.updateOrganizationMetadata(
      organizationId,
      {
        publicMetadata: {
          title,
          description,
        },
      },
    );
  }

  async deleteOrganization(organizationId: string) {
    return this.clerkClient.organizations.deleteOrganization(organizationId);
  }

  // Database operations
  async createDatabaseOrganization(
    data: CreateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationsRepository.create(data);
  }

  async getAllDatabaseOrganizations(): Promise<Organization[]> {
    return this.organizationsRepository.findAll();
  }

  async getDatabaseOrganizationById(id: number): Promise<Organization | null> {
    return this.organizationsRepository.findById(id);
  }

  async getDatabaseOrganizationByClerkId(
    clerkId: string,
  ): Promise<Organization | null> {
    return this.organizationsRepository.findByClerkId(clerkId);
  }

  async updateDatabaseOrganization(
    id: number,
    data: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationsRepository.update(id, data);
  }

  async deleteDatabaseOrganization(id: number): Promise<void> {
    return this.organizationsRepository.delete(id);
  }

  async deleteDatabaseOrganizationByClerkId(clerkId: string): Promise<void> {
    return this.organizationsRepository.deleteByClerkId(clerkId);
  }
}
