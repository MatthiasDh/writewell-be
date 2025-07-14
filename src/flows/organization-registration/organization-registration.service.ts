import { Injectable } from '@nestjs/common';
import { OrganizationsService } from '../../modules/organizations/organizations.service';
import { ContentCalendarService } from '../../modules/content-calendar/content-calendar.service';
import { CreateOrganizationRequestDto } from '../../modules/organizations/dto/create-organization-request.dto';
import { sanitizeUrl } from '../../common/helpers/url.helper';
import { ContentCalendarKeywordService } from '../../modules/content-calendar-keywords/content-calendar-keyword.service';

@Injectable()
export class OrganizationRegistrationService {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly contentCalendarService: ContentCalendarService,
    private readonly contentCalendarKeywordService: ContentCalendarKeywordService,
  ) {}

  /**
   * Executes the complete organization registration flow within a single database transaction
   */
  async executeOrganizationRegistrationFlow(
    createOrganizationDto: CreateOrganizationRequestDto,
    userId: string,
  ): Promise<void> {
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

    // Add keywords to the content calendar instead of directly to the organization
    await this.contentCalendarKeywordService.addKeywordsToContentCalendar(
      contentCalendar.id,
      createOrganizationDto.relevantKeywordIds,
    );

    return;
  }
}
