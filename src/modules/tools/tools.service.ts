import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import { OpenAIService } from '../../common/services/openai.service';
import { WebsiteSummaryDTO } from './dto/website-summary.dto';

@Injectable()
export class ToolsService {
  constructor(private readonly openaiService: OpenAIService) {}

  async scanUrl(url: string): Promise<WebsiteSummaryDTO> {
    let browser: Browser | undefined;

    try {
      // Validate URL
      if (!url || !this.isValidUrl(url)) {
        throw new HttpException('Invalid URL provided', HttpStatus.BAD_REQUEST);
      }

      // Launch browser with Puppeteer
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
      });

      const page: Page = await browser.newPage();

      // Set user agent to avoid being blocked
      await page.setUserAgent(
        'Mozilla/5.0 (compatible; SEO-Optimizer-Bot/1.0)',
      );

      // Set viewport
      await page.setViewport({ width: 1280, height: 720 });

      // Navigate to the URL with timeout
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // Wait for the page to be fully loaded
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Get the HTML content
      const htmlContent = await page.content();

      // Extract text content from HTML
      const textContent = this.extractTextFromHtml(htmlContent);

      // Process with OpenAI
      const summary: WebsiteSummaryDTO =
        await this.openaiService.getSummaryFromText(textContent);

      return summary;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      if (errorMessage.includes('net::ERR_')) {
        throw new HttpException(
          `Failed to fetch URL: ${errorMessage}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Failed to process URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      // Always close the browser
      if (browser) {
        await browser.close();
      }
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private extractTextFromHtml(html: string): string {
    // Basic HTML to text extraction
    // Remove script and style tags

    let text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ') // Remove all HTML tags
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();

    // Limit text length to avoid token limits
    if (text.length > 8000) {
      text = text.substring(0, 8000) + '...';
    }

    return text;
  }
}
