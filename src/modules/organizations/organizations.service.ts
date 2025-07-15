import { Inject, Injectable } from '@nestjs/common';

import { ClerkClient } from '@clerk/backend';
import {
  CreateOrganizationParams,
  UpdateOrganizationParams,
} from './organizations.type';
import { LLMService } from '../../common/services/llm.service';
import { KeywordRepository } from '../keywords/keywords.repository';
import { DataForSEOService } from '../../common/services/dataforseo.service';

@Injectable()
export class OrganizationsService {
  constructor(
    @Inject('ClerkClient')
    private readonly clerkClient: ClerkClient,
  ) {}

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
