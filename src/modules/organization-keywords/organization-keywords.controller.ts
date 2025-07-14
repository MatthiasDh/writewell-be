import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { OrganizationKeywordService } from './organization-keyword.service';
import { CreateOrganizationKeywordsDto } from './dto/create-organization-keyword.dto';
import { User } from '@clerk/backend';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { Keyword } from '../keywords/keyword.entity';
import { GetOrganizationKeywordsDto } from './dto/get-organization-keywords.dto';
import { UserWithOrg } from '../auth/auth.types';

@ApiTags('organization-keywords')
@Controller('organization-keywords')
export class OrganizationKeywordsController {
  constructor(
    private readonly organizationKeywordsService: OrganizationKeywordService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add keywords to organization',
    description:
      "Associate selected keywords with the current user's organization",
  })
  @ApiBody({
    type: CreateOrganizationKeywordsDto,
    description: 'List of keyword IDs to add to the organization',
  })
  @ApiResponse({
    status: 201,
    description: 'Keywords successfully added to organization',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body or keyword IDs',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  async create(
    @CurrentUser() user: UserWithOrg,
    @Body() createOrganizationKeywordDto: CreateOrganizationKeywordsDto,
  ) {
    console.log(user);
    return this.organizationKeywordsService.addKeywordsToOrganization(
      user.orgId,
      createOrganizationKeywordDto.keywordIds,
    );
  }

  @Post('-for-organization')
  @ApiOperation({
    summary:
      'Get all keywords for an organization based on the organizations description',
    description:
      "Retrieves relevant keywords based on the organization's business description using AI analysis",
  })
  @ApiBody({
    type: GetOrganizationKeywordsDto,
    description: 'Organization description to analyze for relevant keywords',
  })
  @ApiResponse({
    status: 200,
    description: 'List of keywords retrieved successfully',
    type: [Keyword],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body or description',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during keyword analysis',
  })
  async findAllForOrganization(
    @Body() dto: GetOrganizationKeywordsDto,
  ): Promise<Keyword[]> {
    // const orgId = user.organizationId;

    return this.organizationKeywordsService.getKeywordsForOrganizationBasedOnDescription(
      dto.description,
    );
  }
}
