import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseUUIDPipe,
  ParseIntPipe,
  HttpStatus,
  UseInterceptors,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationRequestDto } from './dto/create-organization-request.dto';
import { OrganizationResponseDto } from './dto/organization-response.dto';
import { PuppeteerService } from '../../common/services/puppeteer.service';
import { OrganizationSummaryRequestDto } from './dto/generate-summary-request.dto';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { OrganizationSummaryResponseDto } from './dto/generate-summary-response.dto';
import { User } from '@clerk/backend';
import { OrganizationRegistrationService } from '../../flows/organization-registration/organization-registration.service';
import { TransactionInterceptor } from '../../common/transaction.interceptor';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';
import { Organization } from './organization.entity';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly puppeteerService: PuppeteerService,
    private readonly organizationRegistrationService: OrganizationRegistrationService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an organization' })
  @ApiResponse({
    status: 200,
    description: 'Organization created successfully',
    type: String,
  })
  @UseInterceptors(TransactionInterceptor)
  async create(
    @CurrentUser() user: User,
    @Body() createOrganizationRequestDto: CreateOrganizationRequestDto,
  ) {
    try {
      return this.organizationRegistrationService.executeOrganizationRegistrationFlow(
        createOrganizationRequestDto,
        user.id,
      );
    } catch (e) {
      throw new HttpException('Something went wrong', HttpStatus.FORBIDDEN);
    }
  }

  @Post('/tools/generate-summary')
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

  // Database CRUD operations for Organization
  @Post('/database')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a database organization' })
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully',
    type: Organization,
  })
  async createDatabaseOrganization(
    @Body(ValidationPipe) createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationsService.createDatabaseOrganization(
      createOrganizationDto,
    );
  }

  @Get('/database')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all database organizations' })
  @ApiResponse({
    status: 200,
    description: 'Organizations retrieved successfully',
    type: [Organization],
  })
  async getAllDatabaseOrganizations(): Promise<Organization[]> {
    return this.organizationsService.getAllDatabaseOrganizations();
  }

  @Get('/database/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a database organization by ID' })
  @ApiParam({ name: 'id', description: 'Organization ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Organization retrieved successfully',
    type: Organization,
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  async getDatabaseOrganizationById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Organization | null> {
    return this.organizationsService.getDatabaseOrganizationById(id);
  }

  @Get('/database/clerk/:clerkId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a database organization by Clerk ID' })
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

  @Patch('/database/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a database organization' })
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

  @Delete('/database/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a database organization' })
  @ApiParam({ name: 'id', description: 'Organization ID', type: 'number' })
  @ApiResponse({
    status: 204,
    description: 'Organization deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  async deleteDatabaseOrganization(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.organizationsService.deleteDatabaseOrganization(id);
  }
}
