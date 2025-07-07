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
@Controller('content-calendars')
@UseInterceptors(CurrentUserInterceptor)
export class ContentCalendarController {
  constructor(
    private readonly contentCalendarService: ContentCalendarService,
    private readonly openaiService: OpenAIService,
    private readonly tenantsService: TenantsService,
  ) {}

  @Get()
  @ApiBearerAuth()
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

  @Post('generate-blog-content-items')
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

    // Call OpenAI with keywords and generate blog topics
    const blogTopics =
      await this.openaiService.getBlogTopicsFromKeywords(keywords);

    // Get tenant for user
    const tenant = await this.tenantsService.findOne(user.tenantId);

    // Generate content items of type blog for each topic
    const blogContentItems = blogTopics.map((topic) => ({
      type: ContentType.BLOG,
      title: topic,
      content: '',
      publishDate: new Date(),
      isPublished: false,
      contentCalendar: tenant.contentCalendar,
    }));

    await this.contentCalendarService.createContentItems(blogContentItems);

    return null;
  }
}
