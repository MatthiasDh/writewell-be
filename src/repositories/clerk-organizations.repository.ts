import { Injectable, Inject } from '@nestjs/common';
import { ClerkClient } from '@clerk/backend';
import {
  CreateOrganizationParams,
  UpdateOrganizationParams,
} from '../modules/organizations/organizations.type';

@Injectable()
export class ClerkOrganizationsRepository {
  constructor(
    @Inject('ClerkClient')
    private readonly clerkClient: ClerkClient,
  ) {}

  async getOrganization(organizationId: string) {
    return this.clerkClient.organizations.getOrganization({ organizationId });
  }

  async getAllOrganizations() {
    return this.clerkClient.organizations.getOrganizationList();
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

  async addUserToOrganization(
    organizationId: string,
    clerkUserId: string,
    role: 'admin' | 'member',
  ) {
    return this.clerkClient.organizations.createOrganizationMembership({
      organizationId,
      userId: clerkUserId,
      role,
    });
  }

  async deleteOrganization(organizationId: string) {
    return this.clerkClient.organizations.deleteOrganization(organizationId);
  }
}
