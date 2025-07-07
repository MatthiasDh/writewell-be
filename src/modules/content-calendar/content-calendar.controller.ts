import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
  BadRequestException,
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
import { ContentCalendarService } from './content-calendar.service';
import { UpdateContentCalendarDto } from './dto/update-content-calendar.dto';
import { ContentCalendarResponseDto } from './dto/content-calendar-response.dto';
import { OpenAIService } from '../../common/services/openai.service';
import { ContentType } from '../../entities/content-item.entity';
import { CurrentUserInterceptor } from '../../interceptors/current-user.interceptor';
import { JWTUser } from '../../types/auth.type';
import { TenantsService } from '../tenants/tenants.service';
import { CurrentUser } from '../../decorators/current-user.decorator';

@ApiTags('content-calendars')
@Controller('tenant/content-calendar')
@UseInterceptors(CurrentUserInterceptor)
export class ContentCalendarController {
  constructor(
    private readonly contentCalendarService: ContentCalendarService,
    private readonly openaiService: OpenAIService,
    private readonly tenantsService: TenantsService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get content-calendar for tenant' })
  @ApiResponse({
    status: 200,
    description: 'Content-calendar retrieved successfully',
    type: [ContentCalendarResponseDto],
  })
  async findAll(@CurrentUser() { tenantId }: JWTUser) {
    return this.contentCalendarService.findAll(tenantId);
  }

  @Get(':id')
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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

  @Get('upcoming')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get content items with publish dates from today to 30 days ahead',
  })
  @ApiResponse({
    status: 200,
    description: 'Content items retrieved successfully',
    type: 'array',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
          publishDate: { type: 'string', format: 'date-time' },
          isPublished: { type: 'boolean' },
        },
      },
    },
  })
  async getUpcomingContentItems(@CurrentUser() { tenantId }: JWTUser) {
    return this.contentCalendarService.findContentItemsByDateRange(tenantId);
  }

  @Post('generate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate content for a content calendar' })
  @ApiParam({ name: 'id', description: 'Content calendar ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Content generated successfully',
  })
  async generateContent(
    @CurrentUser() user: JWTUser,
    @Body() keywords: string[],
  ) {
    if (!user.tenantId) {
      throw new BadRequestException('User has no tenant');
    }

    const existingContentItems =
      await this.contentCalendarService.findContentItemsByDateRange(
        user.tenantId,
      );

    // If there are fewer than 23 content items in the next 30 days, generate more
    const itemsToGenerate = 30 - existingContentItems.length;
    if (itemsToGenerate >= 7) {
      console.log(`Generating ${itemsToGenerate} more content items`);

      // Calculate the starting date for new content items
      let startDate = new Date();
      if (existingContentItems.length > 0) {
        // Find the latest publish date and add 1 day
        const latestItem =
          existingContentItems[existingContentItems.length - 1];
        startDate = new Date(latestItem.publishDate);
        startDate.setDate(startDate.getDate() + 1);
      }

      const blogTopics = await this.openaiService.getBlogTopicsFromKeywords(
        keywords,
        itemsToGenerate,
      );

      // Get tenant for user
      const tenant = await this.tenantsService.findOne(user.tenantId);

      if (!tenant.contentCalendar) {
        throw new BadRequestException(
          'Tenant does not have a content calendar',
        );
      }

      const blogContentItems = blogTopics.map((topic, index) => ({
        type: ContentType.BLOG,
        title: topic,
        content: '',
        publishDate: new Date(
          startDate.getTime() + index * 24 * 60 * 60 * 1000,
        ),
        isPublished: false,
        contentCalendar: tenant.contentCalendar,
      }));

      console.log(`Creating ${blogContentItems.length} content items`);
      await this.contentCalendarService.createContentItems(blogContentItems);
    }

    return null;
  }
}
