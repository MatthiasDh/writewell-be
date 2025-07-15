import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { KeywordService } from './keywords.service';
import { Keyword } from './keyword.entity';
import { GetOrganizationKeywordsDto } from './dto/get-organization-keywords.dto';

@ApiTags('keywords')
@Controller('keywords')
@ApiBearerAuth()
export class KeywordsController {
  constructor(private readonly keywordService: KeywordService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a keyword by ID' })
  @ApiParam({ name: 'id', description: 'Keyword ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Keyword retrieved successfully',
    type: Keyword,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Keyword> {
    return this.keywordService.findOne(id);
  }

  @Post('keywords-for-organization')
  @ApiOperation({
    summary:
      'Get all keywords for an organization based on the organizations description',
    description:
      "Retrieves relevant keywords based on the organization's business description using AI analysis",
    operationId: 'getOrganizationKeywordsByDescription',
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
    return this.keywordService.findKeywordsForBusinessDescription(
      dto.description,
    );
  }
}
