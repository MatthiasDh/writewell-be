import { Inject, Injectable } from '@nestjs/common';

import { ClerkClient } from '@clerk/backend';
import {
  CreateOrganizationParams,
  UpdateOrganizationParams,
  OrganizationListParams,
  UpdateOrganizationMetadataParams,
} from './organizations.type';

@Injectable()
export class OrganizationsService {
  constructor(
    @Inject('ClerkClient')
    private readonly clerkClient: ClerkClient,
  ) {}

  async getAllOrganizations(params: OrganizationListParams) {
    return this.clerkClient.organizations.getOrganizationList(params);
  }

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
}
