import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import OpenAI from 'openai';

import { isDevelopment } from '../../utils/node.utils';

type WebsiteSummary = {
  title: string;
  summary: string;
};

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getSummaryFromText(textContent: string): Promise<WebsiteSummary> {
    try {
      if (isDevelopment) {
        return {
          title: 'Eco-Friendly Home Goods',
          summary:
            'This e-commerce platform specializes in sustainable home goods, offering a curated collection of eco-friendly products ranging from bamboo kitchenware to organic cotton bedding' +
            'The website features a clean, minimalist design with intuitive navigation that makes it easy for environmentally conscious consumers to browse and purchase products.' +
            'Customers can filter items by sustainability certifications, read detailed product descriptions highlighting eco-friendly materials,' +
            'and access a comprehensive blog section with tips for living a more sustainable lifestyle. The platform also includes customer reviews, detailed shipping information, ' +
            'and a rewards program that encourages repeat purchases while supporting environmental initiatives.',
        };
      }

      const completion = await this.openai.chat.completions.create({
        model: 'o4-mini-2025-04-16',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that summarizes website content. Provide a concise, informative summary of the website content in 3-4 sentences.',
          },
          {
            role: 'user',
            content: `Please summarize the following website content: ${textContent}, also provide an appropriate title for the website,
            this should be a short title that is not too long and precise. Return this in the following format:
            {
              "title": "title",
              "summary": "summary"
            }`,
          },
        ],
      });

      const response = JSON.parse(
        completion.choices[0]?.message?.content ||
          '{"title": "title", "summary": "summary"}',
      ) as WebsiteSummary;

      return {
        title: response.title,
        summary: response.summary,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to generate summary with OpenAI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
