import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ToolsService } from './tools.service';
import { WebsiteSummaryDTO } from './dto/website-summary.dto';
import { DataForSEOService } from '../../common/services/dataforseo.service';
import { KeywordRequestDto } from './dto/keyword-request.dto';

export class ScanUrlDto {
  url: string;
}

@Controller('tools')
export class ToolsController {
  constructor(
    private readonly toolsService: ToolsService,
    private readonly dataForSEOService: DataForSEOService,
  ) {}

  @Post('site-summary')
  async getSiteSummary(
    @Body() scanUrlDto: ScanUrlDto,
  ): Promise<WebsiteSummaryDTO> {
    try {
      const summary = await this.toolsService.scanUrl(scanUrlDto.url);

      return { title: summary.title, summary: summary.summary };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to scan URL';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('keywords')
  async getKeywords(@Body() keywordRequestDto: KeywordRequestDto) {
    try {
      const keywords = await this.dataForSEOService.getRelevantKeywords(
        keywordRequestDto.text,
      );

      return keywords;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch keywords';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
