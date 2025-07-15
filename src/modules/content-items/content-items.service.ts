import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ContentItem, ContentType } from './content-item.entity';
import { ContentItemRepository } from './content-item.repository';
import { LLMService } from '../../common/services/llm.service';
import { ContentCalendarService } from '../content-calendar/content-calendar.service';

@Injectable()
export class ContentItemsService {
  constructor(
    private readonly contentItemRepository: ContentItemRepository,
    private readonly contentCalendarService: ContentCalendarService,
    private readonly llmService: LLMService,
  ) {}

  async findAllByCalendarId(calendarId: string): Promise<ContentItem[]> {
    return this.contentItemRepository.findAllByCalendarId(calendarId);
  }

  async generateTopicsForCalendar(
    calendarId: string,
    numTopics: number,
  ): Promise<ContentItem[]> {
    const calendar = await this.contentCalendarService.findById(calendarId);

    if (!calendar) {
      throw new HttpException('Calendar not found', HttpStatus.NOT_FOUND);
    }

    const existingContentItems =
      await this.contentItemRepository.findAllByCalendarId(calendarId);

    // If there are fewer than 23 content items in the next 30 days, generate more
    const itemsToGenerate = 30 - existingContentItems.length;

    let blogContentItems: ContentItem[] = [];

    if (itemsToGenerate >= 7) {
      // Calculate the starting date for new content items
      let startDate = new Date();
      if (existingContentItems.length > 0) {
        // Find the latest publish date and add 1 day
        const latestItem =
          existingContentItems[existingContentItems.length - 1];
        startDate = new Date(latestItem.publishDate);
        startDate.setDate(startDate.getDate() + 1);
      }

      const blogTopics = await this.llmService.getContentTopics(
        calendar.keywords.map((keyword) => keyword.keyword),
        itemsToGenerate,
      );

      blogContentItems = blogTopics.map((topic, index) => {
        const contentItem = new ContentItem();
        contentItem.type = ContentType.BLOG;
        contentItem.title = topic;
        contentItem.content = '';
        contentItem.publishDate = new Date(
          startDate.getTime() + index * 24 * 60 * 60 * 1000,
        );
        contentItem.isPublished = false;
        contentItem.contentCalendar = calendar;
        return contentItem;
      });

      await this.contentItemRepository.createMultiple(blogContentItems);
    }

    return blogContentItems;
  }
}
