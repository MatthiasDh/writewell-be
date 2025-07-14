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

@ApiTags('keywords')
@Controller('keywords')
@ApiBearerAuth()
export class KeywordsController {
  constructor(private readonly keywordService: KeywordService) {}

  @Get()
  @ApiOperation({ summary: 'Get all keywords' })
  @ApiResponse({
    status: 200,
    description: 'List of keywords retrieved successfully',
    type: [Keyword],
  })
  async findAll(): Promise<Keyword[]> {
    return this.keywordService.findAll();
  }

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
}
