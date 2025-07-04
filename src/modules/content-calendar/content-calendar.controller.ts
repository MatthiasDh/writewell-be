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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { ContentCalendarService } from './content-calendar.service';
import { CreateContentCalendarDto } from './dto/create-content-calendar.dto';
import { UpdateContentCalendarDto } from './dto/update-content-calendar.dto';
import { ContentCalendarResponseDto } from './dto/content-calendar-response.dto';

@ApiTags('content-calendars')
@Controller('content-calendars')
export class ContentCalendarController {
  constructor(
    private readonly contentCalendarService: ContentCalendarService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new content calendar' })
  @ApiResponse({
    status: 201,
    description: 'Content calendar created successfully',
    type: ContentCalendarResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiConflictResponse({
    description: 'Account already has a content calendar',
  })
  @ApiBody({ type: CreateContentCalendarDto })
  async create(
    @Body(ValidationPipe) createContentCalendarDto: CreateContentCalendarDto,
  ) {
    return this.contentCalendarService.create(createContentCalendarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all content calendars' })
  @ApiResponse({
    status: 200,
    description: 'List of content calendars retrieved successfully',
    type: [ContentCalendarResponseDto],
  })
  async findAll() {
    return this.contentCalendarService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a content calendar by ID' })
  @ApiParam({ name: 'id', description: 'Content calendar ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Content calendar retrieved successfully',
    type: ContentCalendarResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Content calendar not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentCalendarService.findOne(id);
  }

  @Get('account/:accountId')
  @ApiOperation({ summary: 'Get content calendar by account ID' })
  @ApiParam({ name: 'accountId', description: 'Account ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Content calendar retrieved successfully',
    type: ContentCalendarResponseDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No content calendar found for this account',
  })
  async findByAccount(@Param('accountId', ParseUUIDPipe) accountId: string) {
    return this.contentCalendarService.findByAccount(accountId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get content calendars by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Content calendars retrieved successfully',
    type: [ContentCalendarResponseDto],
  })
  async findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.contentCalendarService.findByUser(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a content calendar' })
  @ApiParam({ name: 'id', description: 'Content calendar ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Content calendar updated successfully',
    type: ContentCalendarResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Content calendar not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBody({ type: UpdateContentCalendarDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateContentCalendarDto: UpdateContentCalendarDto,
  ) {
    return this.contentCalendarService.update(id, updateContentCalendarDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a content calendar' })
  @ApiParam({ name: 'id', description: 'Content calendar ID', type: 'string' })
  @ApiResponse({
    status: 204,
    description: 'Content calendar deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Content calendar not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.contentCalendarService.remove(id);
  }
}
