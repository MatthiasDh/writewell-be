import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import {
  BusinessRelevantKeywordsRequestDto,
  BusinessRelevantKeywordsResponseDTO,
  WebsiteSummaryRequestDto,
  WebsiteSummaryResponseDTO,
} from './dto/website-summary.dto';
import { DataForSEOService } from '../../common/services/dataforseo.service';
import { KeywordRequestDto, KeywordResponseDto } from './dto/keywords.dto';
import { PuppeteerService } from '../../common/services/puppeteer.service';
import { OpenAIService } from '../../common/services/openai.service';

@ApiTags('tools')
@Controller('tools')
export class ToolsController {
  constructor(
    private readonly puppeteerService: PuppeteerService,
    private readonly dataForSEOService: DataForSEOService,
    private readonly openaiService: OpenAIService,
  ) {}

  @Post('business-summary')
  @ApiResponse({
    status: 200,
    type: WebsiteSummaryResponseDTO,
  })
  @ApiResponse({
    status: 500,
  })
  async getBusinessSummary(
    @Body() websiteSummaryRequest: WebsiteSummaryRequestDto,
  ): Promise<WebsiteSummaryResponseDTO> {
    try {
      const summary = await this.puppeteerService.scanUrl(
        websiteSummaryRequest.url,
      );

      return {
        title: summary.title,
        summary: summary.summary,
      };
    } catch {
      throw new HttpException(
        'Failed to scan URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('business-keywords')
  @ApiResponse({
    status: 200,
    type: BusinessRelevantKeywordsResponseDTO,
  })
  @ApiResponse({
    status: 500,
  })
  async getBusinessKeywords(
    @Body() businessRelevantKeywordsRequest: BusinessRelevantKeywordsRequestDto,
  ): Promise<BusinessRelevantKeywordsResponseDTO> {
    try {
      const summary =
        await this.openaiService.getRelevantKeywordsFromBusinessContext(
          businessRelevantKeywordsRequest.context,
        );

      return {
        keywords: summary.keywords,
      };
    } catch {
      throw new HttpException(
        'Failed to scan URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('keyword-insights')
  @ApiResponse({
    status: 200,
    type: KeywordResponseDto,
  })
  @ApiResponse({
    status: 500,
  })
  async getKeywordsInsights(
    @Body() keywordRequestDto: KeywordRequestDto,
  ): Promise<KeywordResponseDto> {
    try {
      const keywords = await this.dataForSEOService.getKeywordsInsights(
        keywordRequestDto.keywords,
      );

      return { keywords };
    } catch {
      throw new HttpException(
        'Failed to fetch keywords',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
