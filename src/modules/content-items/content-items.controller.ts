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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ContentItemsService } from './content-items.service';
import { CreateContentItemDto } from './dto/create-content-item.dto';
import { UpdateContentItemDto } from './dto/update-content-item.dto';
import { ContentItemResponseDto } from './dto/content-item-response.dto';
import { ContentType } from '../../entities/content-item.entity';

@ApiTags('content-items')
@Controller('content-items')
export class ContentItemsController {
  constructor(private readonly contentItemsService: ContentItemsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new content item' })
  @ApiResponse({
    status: 201,
    description: 'Content item created successfully',
    type: ContentItemResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Content calendar not found' })
  @ApiBody({ type: CreateContentItemDto })
  async create(
    @Body(ValidationPipe) createContentItemDto: CreateContentItemDto,
  ) {
    return this.contentItemsService.create(createContentItemDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all content items' })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ContentType,
    description: 'Filter by content type',
  })
  @ApiQuery({
    name: 'published',
    required: false,
    type: Boolean,
    description: 'Filter by published status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of content items retrieved successfully',
    type: [ContentItemResponseDto],
  })
  async findAll(
    @Query('type') type?: ContentType,
    @Query('published') published?: boolean,
  ) {
    if (type) {
      return this.contentItemsService.findByType(type);
    }
    if (published === true) {
      return this.contentItemsService.findPublished();
    }
    if (published === false) {
      return this.contentItemsService.findDrafts();
    }
    return this.contentItemsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a content item by ID' })
  @ApiParam({ name: 'id', description: 'Content item ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Content item retrieved successfully',
    type: ContentItemResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Content item not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentItemsService.findOne(id);
  }

  @Get('calendar/:calendarId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get content items by calendar ID' })
  @ApiParam({
    name: 'calendarId',
    description: 'Content calendar ID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Content items retrieved successfully',
    type: [ContentItemResponseDto],
  })
  async findByCalendar(@Param('calendarId', ParseUUIDPipe) calendarId: string) {
    return this.contentItemsService.findByCalendar(calendarId);
  }

  @Get('account/:accountId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get content items by account ID' })
  @ApiParam({ name: 'accountId', description: 'Account ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Content items retrieved successfully',
    type: [ContentItemResponseDto],
  })
  async findByAccount(@Param('accountId', ParseUUIDPipe) accountId: string) {
    return this.contentItemsService.findByAccount(accountId);
  }

  @Get('date-range')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get content items by date range' })
  @ApiQuery({
    name: 'startDate',
    required: true,
    type: String,
    description: 'Start date (ISO string)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    type: String,
    description: 'End date (ISO string)',
  })
  @ApiResponse({
    status: 200,
    description: 'Content items retrieved successfully',
    type: [ContentItemResponseDto],
  })
  @ApiBadRequestResponse({ description: 'Invalid date format' })
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.contentItemsService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a content item' })
  @ApiParam({ name: 'id', description: 'Content item ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Content item updated successfully',
    type: ContentItemResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Content item not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBody({ type: UpdateContentItemDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateContentItemDto: UpdateContentItemDto,
  ) {
    return this.contentItemsService.update(id, updateContentItemDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a content item' })
  @ApiParam({ name: 'id', description: 'Content item ID', type: 'string' })
  @ApiResponse({
    status: 204,
    description: 'Content item deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Content item not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.contentItemsService.remove(id);
  }

  @Post(':id/publish')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a content item' })
  @ApiParam({ name: 'id', description: 'Content item ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Content item published successfully',
    type: ContentItemResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Content item not found' })
  async publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentItemsService.publish(id);
  }

  @Post(':id/unpublish')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unpublish a content item' })
  @ApiParam({ name: 'id', description: 'Content item ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Content item unpublished successfully',
    type: ContentItemResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Content item not found' })
  async unpublish(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentItemsService.unpublish(id);
  }
}
