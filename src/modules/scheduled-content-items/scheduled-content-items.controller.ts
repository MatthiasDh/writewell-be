import {
  Controller,
  Get,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ScheduledContentItemsService } from './scheduled-content-items.service';
import { ScheduledContentItem } from './scheduled-content-item.entity';
import { UpdateScheduledContentItemDto } from './dto';

@ApiTags('scheduled-content-items')
@Controller('scheduled-content-items')
export class ScheduledContentItemsController {
  constructor(
    private readonly scheduledContentItemsService: ScheduledContentItemsService,
  ) {}

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a scheduled content item by ID',
    operationId: 'getScheduledContentItem',
  })
  @ApiParam({
    name: 'id',
    description: 'Scheduled content item ID',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'The scheduled content item details.',
    type: ScheduledContentItem,
  })
  @ApiNotFoundResponse({ description: 'Scheduled content item not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ScheduledContentItem> {
    return this.scheduledContentItemsService.findOne(id);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get scheduled content items for an organization',
    operationId: 'getScheduledContentItems',
  })
  @ApiResponse({
    status: 200,
    description: 'List of scheduled content items for the organization.',
    type: [ScheduledContentItem],
  })
  async findByOrganization(
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ): Promise<ScheduledContentItem[]> {
    return this.scheduledContentItemsService.findByOrganization(organizationId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a scheduled content item',
    operationId: 'updateScheduledContentItem',
  })
  @ApiParam({
    name: 'id',
    description: 'Scheduled content item ID',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'The scheduled content item has been updated successfully.',
    type: ScheduledContentItem,
  })
  @ApiNotFoundResponse({ description: 'Scheduled content item not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) data: UpdateScheduledContentItemDto,
  ): Promise<ScheduledContentItem> {
    return this.scheduledContentItemsService.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a scheduled content item',
    operationId: 'deleteScheduledContentItem',
  })
  @ApiParam({
    name: 'id',
    description: 'Scheduled content item ID',
    type: 'number',
  })
  @ApiResponse({
    status: 204,
    description: 'The scheduled content item has been deleted successfully.',
  })
  @ApiNotFoundResponse({ description: 'Scheduled content item not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.scheduledContentItemsService.remove(id);
  }
}
