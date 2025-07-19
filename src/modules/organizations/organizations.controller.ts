import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ValidationPipe,
  ParseIntPipe,
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
import { UpdateOrganizationDto } from './dto';
import { Organization } from './organization.entity';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly puppeteerService: PuppeteerService,
  ) {}

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
  async generateSummary(
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

  @Get('/')
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
  @ApiParam({ name: 'id', description: 'Organization ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Organization updated successfully',
    type: Organization,
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  async updateDatabaseOrganization(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationsService.updateDatabaseOrganization(
      id,
      updateOrganizationDto,
    );
  }
}
