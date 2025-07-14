import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ValidationPipe,
  ParseUUIDPipe,
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
} from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationRequestDto } from './dto/create-organization-request.dto';
import { OrganizationResponseDto } from './dto/organization-response.dto';
import { PuppeteerService } from '../../common/services/puppeteer.service';
import { OrganizationSummaryRequestDto } from './dto/generate-summary-request.dto';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { OrganizationSummaryResponseDto } from './dto/generate-summary-response.dto';
import { UpdateOrganizationDto } from './organizations.dtos';
import { User } from '@clerk/backend';
import { OrganizationRegistrationService } from '../../flows/organization-registration/organization-registration.service';
import { TransactionInterceptor } from '../../common/transaction.interceptor';

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
    type: OrganizationResponseDto,
  })
  @UseInterceptors(TransactionInterceptor)
  async create(
    @CurrentUser() user: User,
    @Body() createOrganizationRequestDto: CreateOrganizationRequestDto,
  ) {
    return this.organizationRegistrationService.executeOrganizationRegistrationFlow(
      createOrganizationRequestDto,
      user.id,
    );
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({
    status: 200,
    description: 'List of organizations retrieved successfully',
    type: [OrganizationResponseDto],
  })
  async findAll(@CurrentUser() user: User) {
    return this.organizationsService.getAllOrganizations({});
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an organization by ID' })
  @ApiParam({ name: 'id', description: 'Organization ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Organization retrieved successfully',
    type: OrganizationResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.organizationsService.getOrganization(id);
  }

  @Get('user/:userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get organizations by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Organizations retrieved successfully',
    type: [OrganizationResponseDto],
  })
  async findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.organizationsService.getOrganization(userId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an organization' })
  @ApiParam({ name: 'id', description: 'Organization ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Organization updated successfully',
    type: OrganizationResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  // @ApiBody({ type: typeof UpdateOrganizationDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.updateOrganization(
      id,
      updateOrganizationDto,
    );
  }

  // @Post(':id/keywords')
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Add keywords to organization' })
  // @ApiParam({ name: 'id', description: 'Organization ID', type: 'string' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Keywords added successfully',
  //   type: OrganizationResponseDto,
  // })
  // @ApiNotFoundResponse({ description: 'Organization not found' })
  // @ApiBadRequestResponse({ description: 'Invalid input data' })
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       keywords: {
  //         type: 'array',
  //         items: { type: 'string' },
  //       },
  //     },
  //   },
  // })
  // async addKeywords(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body('keywords') keywords: string[],
  // ) {
  //   return this.organizationsService.addKeywords(id, keywords);
  // }

  // @Delete(':id/keywords')
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Remove keywords from organization' })
  // @ApiParam({ name: 'id', description: 'Organization ID', type: 'string' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Keywords removed successfully',
  //   type: OrganizationResponseDto,
  // })
  // @ApiNotFoundResponse({ description: 'Organization not found' })
  // @ApiBadRequestResponse({ description: 'Invalid input data' })
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       keywords: {
  //         type: 'array',
  //         items: { type: 'string' },
  //       },
  //     },
  //   },
  // })
  // async removeKeywords(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body('keywords') keywords: string[],
  // ) {
  //   return this.organizationsService.removeKeywords(id, keywords);
  // }

  @Post('/tools/generate-summary')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Generates a summary for the organization based on the website',
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
      console.log(e);
      throw new HttpException(
        'Failed to scan URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Post('/tools/generate-keywords')
  // @ApiBearerAuth()
  // @ApiOperation({
  //   summary:
  //     'Generates a list of relevant SEO keywords for the organization based on the organizations description',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Keywords generated successfully',
  //   type: BusinessRelevantKeywordsResponseDTO,
  // })
  // async generateKeywords(
  //   @CurrentUser() user: JWTUser,
  //   @Body() businessRelevantKeywordsRequest: BusinessRelevantKeywordsRequestDto,
  // ): Promise<BusinessRelevantKeywordsResponseDTO> {
  //   try {
  //     // Get relevant keywords from the business context
  //     const businessRelevantKeywords =
  //       await this.openaiService.getRelevantKeywordsFromBusinessContext(
  //         businessRelevantKeywordsRequest.context,
  //       );

  //     // Store the keywords in the organization
  //     await this.organizationsService.update(user.tenantId, {
  //       keywords: businessRelevantKeywords.keywords,
  //     });

  //     const keywordInsights = await this.dataForSEOService.getKeywordsInsights(
  //       businessRelevantKeywords.keywords,
  //     );

  //     return { keywords: keywordInsights };
  //   } catch {
  //     throw new HttpException(
  //       'Failed to fetch keywords',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // @Post('/tools/generate-content')
  // @ApiBearerAuth()
  // @ApiOperation({
  //   summary: 'Generates content for the organization based on the website',
  // })
  // createContent() {
  //   return 'WIP';
  // }
}
