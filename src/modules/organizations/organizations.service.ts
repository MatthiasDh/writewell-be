import { Injectable } from '@nestjs/common';
import { OrganizationsRepository } from './organizations.repository';
import { ClerkOrganizationsRepository } from './clerk-organizations.repository';
import { Organization } from './organization.entity';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';
import {
  CreateOrganizationParams,
  UpdateOrganizationParams,
} from './organizations.type';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly clerkOrganizationsRepository: ClerkOrganizationsRepository,
    private readonly organizationsRepository: OrganizationsRepository,
  ) {}

  // Clerk operations
  async getOrganization(organizationId: string) {
    return this.clerkOrganizationsRepository.getOrganization(organizationId);
  }

  async createOrganization(params: CreateOrganizationParams) {
    return this.clerkOrganizationsRepository.createOrganization(params);
  }

  async updateOrganization(
    organizationId: string,
    params: UpdateOrganizationParams,
  ) {
    return this.clerkOrganizationsRepository.updateOrganization(
      organizationId,
      params,
    );
  }

  async updateOrganizationDescription(
    organizationId: string,
    title: string,
    description: string,
  ) {
    return this.clerkOrganizationsRepository.updateOrganization(
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
    return this.clerkOrganizationsRepository.deleteOrganization(organizationId);
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
