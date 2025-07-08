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
  HttpCode,
  HttpStatus,
  UseInterceptors,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantResponseDto } from './dto/tenant-response.dto';
import { PuppeteerService } from '../../common/services/puppeteer.service';
import { JWTUser } from '../../types/auth.type';
import { CurrentUserInterceptor } from '../../interceptors/current-user.interceptor';
import { TenantSummaryRequestDto } from './dto/generate-summary-request.dto';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { TenantSummaryResponseDto } from './dto/generate-summary-response.dto';
import { OpenAIService } from '../../common/services/openai.service';
import { DataForSEOService } from '../../common/services/dataforseo.service';
import { BusinessRelevantKeywordsRequestDto } from './dto/generate-keywords-request.dto';
import { BusinessRelevantKeywordsResponseDTO } from './dto/generate-keywords-response.dto';

@ApiTags('tenants')
@Controller('tenants')
@UseInterceptors(CurrentUserInterceptor)
export class TenantsController {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly puppeteerService: PuppeteerService,
    private readonly openaiService: OpenAIService,
    private readonly dataForSEOService: DataForSEOService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully',
    type: TenantResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBody({ type: CreateTenantDto })
  async create(@Body(ValidationPipe) createAccountDto: CreateTenantDto) {
    return this.tenantsService.create(createAccountDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all tenants' })
  @ApiResponse({
    status: 200,
    description: 'List of tenants retrieved successfully',
    type: [TenantResponseDto],
  })
  async findAll(@CurrentUser() user: JWTUser) {
    return this.tenantsService.findAll(user.sub);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a tenant by ID' })
  @ApiParam({ name: 'id', description: 'Tenant ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Tenant retrieved successfully',
    type: TenantResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Tenant not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tenantsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tenants by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Tenants retrieved successfully',
    type: [TenantResponseDto],
  })
  async findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.tenantsService.findByUser(userId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a tenant' })
  @ApiParam({ name: 'id', description: 'Tenant ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Tenant updated successfully',
    type: TenantResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Tenant not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBody({ type: UpdateTenantDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateAccountDto: UpdateTenantDto,
  ) {
    return this.tenantsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an account' })
  @ApiParam({ name: 'id', description: 'Account ID', type: 'string' })
  @ApiResponse({
    status: 204,
    description: 'Account deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.tenantsService.remove(id);
  }

  @Post(':id/keywords')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add keywords to account' })
  @ApiParam({ name: 'id', description: 'Account ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Keywords added successfully',
    type: TenantResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        keywords: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  async addKeywords(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('keywords') keywords: string[],
  ) {
    return this.tenantsService.addKeywords(id, keywords);
  }

  @Delete(':id/keywords')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove keywords from account' })
  @ApiParam({ name: 'id', description: 'Account ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Keywords removed successfully',
    type: TenantResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        keywords: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  async removeKeywords(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('keywords') keywords: string[],
  ) {
    return this.tenantsService.removeKeywords(id, keywords);
  }

  @Post('/tools/generate-summary')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Generates a summary for the tenant based on the website',
  })
  @ApiResponse({
    status: 200,
    description: 'Summary generated successfully',
    type: String,
  })
  async generateSummary(
    @CurrentUser() user: JWTUser,
    @Body() tenantSummaryRequest: TenantSummaryRequestDto,
  ): Promise<TenantSummaryResponseDto> {
    try {
      // Get summary from business
      const summary = await this.puppeteerService.scanUrl(
        tenantSummaryRequest.url,
      );

      // Update tenant with summary
      await this.tenantsService.update(user.tenantId, {
        title: summary.title,
        description: summary.summary,
      });

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

  @Post('/tools/generate-keywords')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Generates a list of relevant SEO keywords for the tenant based on the tenants description',
  })
  @ApiResponse({
    status: 200,
    description: 'Keywords generated successfully',
    type: BusinessRelevantKeywordsResponseDTO,
  })
  async generateKeywords(
    @CurrentUser() user: JWTUser,
    @Body() businessRelevantKeywordsRequest: BusinessRelevantKeywordsRequestDto,
  ): Promise<BusinessRelevantKeywordsResponseDTO> {
    try {
      // Get relevant keywords from the business context
      const businessRelevantKeywords =
        await this.openaiService.getRelevantKeywordsFromBusinessContext(
          businessRelevantKeywordsRequest.context,
        );

      // Store the keywords in the account
      await this.tenantsService.update(user.tenantId, {
        keywords: businessRelevantKeywords.keywords,
      });

      const keywordInsights = await this.dataForSEOService.getKeywordsInsights(
        businessRelevantKeywords.keywords,
      );

      return { keywords: keywordInsights };
    } catch {
      throw new HttpException(
        'Failed to fetch keywords',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/tools/generate-content')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Generates content for the tenant based on the website',
  })
  createContent() {
    return 'WIP';
  }
}
