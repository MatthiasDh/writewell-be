import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ValidationPipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { PuppeteerService } from '../../common/services/puppeteer.service';
import { OrganizationSummaryRequestDto } from './dto/generate-summary-request.dto';
import { OrganizationSummaryResponseDto } from './dto/generate-summary-response.dto';
import { CreateOrganizationRequestDto, UpdateOrganizationDto } from './dto';
import { Organization } from './organization.entity';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { User } from '../users/user.entity';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly puppeteerService: PuppeteerService,
  ) {}

  @Post('/keywords')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get keywords for an organization',
    operationId: 'getOrganizationKeywords',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization created successfully',
    type: Organization,
  })
  async getOrganizationKeywords(
    @Body() organizationSummaryRequest: OrganizationSummaryRequestDto,
  ): Promise<{ keywords: string[] }> {
    return {
      keywords: [],
    };
  }

  @Post('/summary')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Generates a summary for the organization based on the website',
    operationId: 'getOrganizationSummary',
  })
  @ApiResponse({
    status: 200,
    description: 'Summary generated successfully',
    type: OrganizationSummaryResponseDto,
  })
  async summary(
    @Body() organizationSummaryRequest: OrganizationSummaryRequestDto,
  ): Promise<OrganizationSummaryResponseDto> {
    try {
      // Scrape html to get summary
      const summary = await this.puppeteerService.scanUrl(
        organizationSummaryRequest.url,
      );

      return {
        title: summary.title,
        summary: summary.summary,
      };
    } catch (e) {
      throw new HttpException(
        'Failed to scan URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/current')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get users current active organization',
    operationId: 'getOrganization',
  })
  @ApiParam({
    name: 'clerkId',
    description: 'Clerk organization ID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization retrieved successfully',
    type: Organization,
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  async getDatabaseOrganizationByClerkId(
    @Param('clerkId') clerkId: string,
  ): Promise<Organization | null> {
    return this.organizationsService.getDatabaseOrganizationByClerkId(clerkId);
  }

  @Patch('/')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a database organization',
    operationId: 'updateOrganization',
  })
  @ApiParam({ name: 'id', description: 'Organization ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Organization updated successfully',
    type: Organization,
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  async updateOrganization(
    @Param('id') id: string,
    @Body(ValidationPipe) updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationsService.updateDatabaseOrganization(
      id,
      updateOrganizationDto,
    );
  }

  @Post('/')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new organization',
    operationId: 'createOrganization',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization created successfully',
    type: Organization,
  })
  async createOrganization(
    @CurrentUser() currentUser: User,
    @Body() createOrganizationDto: CreateOrganizationRequestDto,
  ): Promise<string> {
    return this.organizationsService.create(
      currentUser.id,
      createOrganizationDto,
    );
  }
}
