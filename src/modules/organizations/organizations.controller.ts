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
  ApiBody,
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
import { Keyword } from '../keywords/keyword.entity';
import { GetOrganizationKeywordsDto } from '../keywords/dto/get-organization-keywords.dto';

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
}
