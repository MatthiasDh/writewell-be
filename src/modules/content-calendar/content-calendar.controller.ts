import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  ValidationPipe,
  ParseUUIDPipe,
  HttpStatus,
  NotFoundException,
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
import { ContentCalendarResponseDto } from './dto/content-calendar-response.dto';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { UserWithOrg } from '../auth/auth.types';
import { ContentCalendar } from './content-calendar.entity';
import { ContentItemsService } from '../content-items/content-items.service';
import { KeywordService } from '../keywords/keywords.service';

@ApiTags('content-calendars')
@Controller('organization/content-calendar')
export class ContentCalendarController {
  constructor(
    private readonly contentCalendarService: ContentCalendarService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all', operationId: 'getContentCalendar' })
  @ApiResponse({
    status: 200,
    description: 'Content calendar with content items retrieved successfully',
    type: ContentCalendarResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Content calendar not found',
  })
  async getContentCalendar(
    @CurrentUser() { orgId }: UserWithOrg,
  ): Promise<ContentCalendar | null> {
    const calendar = await this.contentCalendarService.findByOrgId(orgId);

    if (!calendar) {
      throw new NotFoundException('Content calendar not found');
    }

    return calendar;
  }
}
