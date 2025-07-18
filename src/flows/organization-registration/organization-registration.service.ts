import { Injectable } from '@nestjs/common';
import { OrganizationsService } from '../../modules/organizations/organizations.service';
import { CreateOrganizationRequestDto } from '../../modules/organizations/dto/create-organization-request.dto';
import { sanitizeUrl } from '../../common/helpers/url.helper';

@Injectable()
export class OrganizationRegistrationService {
  constructor(private readonly organizationsService: OrganizationsService) {}

  /**
   * Executes the complete organization registration flow within a single database transaction
   */
  async executeOrganizationRegistrationFlow(
    createOrganizationDto: CreateOrganizationRequestDto,
    userId: string,
  ): Promise<string> {
    // Create organization based on the website url
    const newOrganization = await this.organizationsService.createOrganization({
      name: sanitizeUrl(createOrganizationDto.domain).replace('-', ' '),
      slug: sanitizeUrl(createOrganizationDto.domain),
      createdBy: userId,
      publicMetadata: {
        title: createOrganizationDto.title,
        description: createOrganizationDto.description,
      },
    });

    // TODO: Integrate with new content module
    // - Create organization settings
    // - Set up initial scheduled content items
    // - Configure content generation preferences

    return newOrganization.id;
  }
}
