import { Injectable } from '@nestjs/common';
import { OrganizationsService } from '../../modules/organizations/organizations.service';
import { ContentCalendarService } from '../../modules/content-calendar/content-calendar.service';
import { CreateOrganizationRequestDto } from '../../modules/organizations/dto/create-organization-request.dto';
import { sanitizeUrl } from '../../common/helpers/url.helper';
import { ContentItemsService } from '../../modules/content-items/content-items.service';

@Injectable()
export class OrganizationRegistrationService {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly contentCalendarService: ContentCalendarService,
    private readonly contentItemsService: ContentItemsService,
  ) {}

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

    // Create content calendar for the organization
    const contentCalendar = await this.contentCalendarService.create(
      newOrganization.id,
    );

    // Add content calendar to the organization
    await this.contentCalendarService.addKeywords(
      contentCalendar.id,
      createOrganizationDto.relevantKeywordIds,
    );

    // Populate 30 days worth of topics for the content calendar
    await this.contentItemsService.generateTopicsForCalendar(
      contentCalendar.id,
      30,
    );

    return newOrganization.id;
  }
}
