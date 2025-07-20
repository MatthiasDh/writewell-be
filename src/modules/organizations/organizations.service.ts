import { Injectable } from '@nestjs/common';
import { OrganizationsRepository } from './organizations.repository';
import { ClerkOrganizationsRepository } from '../../repositories/clerk-organizations.repository';
import { Organization } from './organization.entity';
import { CreateOrganizationRequestDto, UpdateOrganizationDto } from './dto';
import { UpdateOrganizationParams } from './organizations.type';
import { sanitizeUrl } from '../../common/helpers/url.helper';
import { UsersService } from '../users/users.service';
import { ClerkUsersRepository } from '../../repositories/clerk-users.repository';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly clerkOrganizationsRepository: ClerkOrganizationsRepository,
    private readonly clerkUsersRepository: ClerkUsersRepository,
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly usersService: UsersService,
  ) {}

  async getOrganization(organizationId: string) {
    return this.clerkOrganizationsRepository.getOrganization(organizationId);
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

  async deleteOrganization(organizationId: string) {
    return this.clerkOrganizationsRepository.deleteOrganization(organizationId);
  }

  async create(
    userId: string,
    data: CreateOrganizationRequestDto,
  ): Promise<string> {
    // Get current user
    const currentUser = await this.usersService.getUserById(userId);

    if (!currentUser) {
      throw new Error('Current user not found');
    }

    // Create organization in Clerk
    const clerkOrganization =
      await this.clerkOrganizationsRepository.createOrganization({
        name: sanitizeUrl(data.domain).replace('-', ' '),
        slug: sanitizeUrl(data.domain),
        createdBy: currentUser.clerk_user_id,
      });

    // Create organization in database
    const newOrganization = await this.organizationsRepository.create({
      clerk_organization_id: clerkOrganization.id,
      name: clerkOrganization.name,
      description: data.description,
      domain: data.domain,
      example_blog_post_urls: [],
      users: [currentUser],
    });

    return newOrganization.clerk_organization_id;
  }

  async getAllDatabaseOrganizations(): Promise<Organization[]> {
    return this.organizationsRepository.findAll();
  }

  async getDatabaseOrganizationById(id: string): Promise<Organization | null> {
    return this.organizationsRepository.findById(id);
  }

  async getDatabaseOrganizationByClerkId(
    clerkId: string,
  ): Promise<Organization | null> {
    return this.organizationsRepository.findByClerkId(clerkId);
  }

  async updateDatabaseOrganization(
    id: string,
    data: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationsRepository.update(id, data);
  }

  async deleteDatabaseOrganization(id: string): Promise<void> {
    return this.organizationsRepository.delete(id);
  }

  async deleteDatabaseOrganizationByClerkId(clerkId: string): Promise<void> {
    return this.organizationsRepository.deleteByClerkId(clerkId);
  }
}
