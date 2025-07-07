import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import OpenAI from 'openai';

import {
  BUSINESS_RELEVANT_KEYWORDS_MOCKUP,
  BUSINESS_SUMMARY_MOCKUP,
} from '../mockup/business-summary.mockup';
import {
  BUSINESS_SUMMARY_PROMPT,
  BUSINESS_RELEVANT_KEYWORDS_PROMPT,
  BLOG_TOPICS_PROMPT,
} from '../prompts/openai.prompt';

type BusinessSummary = {
  title: string;
  summary: string;
};

type BusinessRelevantKeywords = {
  keywords: string[];
};

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getSummaryFromBusinessContext(
    textContent: string,
  ): Promise<BusinessSummary> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return BUSINESS_SUMMARY_MOCKUP;
      }

      const completion = await this.openai.chat.completions.create({
        model: 'o4-mini-2025-04-16',
        messages: [
          {
            role: 'system',
            content: BUSINESS_SUMMARY_PROMPT,
          },
          {
            role: 'user',
            content: `Please summarize the following website content: ${textContent}`,
          },
        ],
      });

      const response = JSON.parse(
        completion.choices[0]?.message?.content ||
          '{"title": "title", "summary": "summary"}',
      ) as BusinessSummary;

      return {
        title: response.title,
        summary: response.summary,
      };
    } catch {
      throw new HttpException(
        'Failed to generate summary',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRelevantKeywordsFromBusinessContext(
    context: string,
  ): Promise<BusinessRelevantKeywords> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return BUSINESS_RELEVANT_KEYWORDS_MOCKUP;
      }

      const completion = await this.openai.chat.completions.create({
        model: 'o4-mini-2025-04-16',
        messages: [
          {
            role: 'system',
            content: BUSINESS_RELEVANT_KEYWORDS_PROMPT,
          },
          {
            role: 'user',
            content: `Please summarize the following website content: ${context}`,
          },
        ],
      });

      const response = JSON.parse(
        completion.choices[0]?.message?.content ||
          '{"keywords": ["keyword1", "keyword2", "keyword3"]}',
      ) as BusinessRelevantKeywords;

      return {
        keywords: response.keywords,
      };
    } catch {
      throw new HttpException(
        'Failed to generate keywords',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBlogTopicsFromKeywords(
    keywords: string[],
    amount: number,
  ): Promise<string[]> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return [
          '10 Essential Tips for Remote Work Productivity',
          'The Future of Artificial Intelligence in Healthcare',
          'Sustainable Living: Small Changes That Make a Big Impact',
          'Digital Marketing Trends to Watch in 2024',
          'How to Build a Personal Brand on Social Media',
          'The Psychology Behind Consumer Decision Making',
          'Cybersecurity Best Practices for Small Businesses',
          'The Rise of Plant-Based Nutrition and Its Benefits',
          "Understanding Cryptocurrency: A Beginner's Guide",
          'Time Management Strategies for Busy Professionals',
          'The Impact of Climate Change on Global Agriculture',
          'Creative Writing Techniques to Improve Your Storytelling',
          'E-commerce Optimization: Converting Visitors to Customers',
          'Mental Health in the Digital Age: Finding Balance',
          'The Evolution of Workplace Culture Post-Pandemic',
          'Photography Tips for Capturing Perfect Travel Moments',
          'Financial Planning for Millennials: Getting Started',
          'The Science Behind Habit Formation and Breaking',
          'Innovative Technologies Transforming Education',
          "Building Resilience: Overcoming Life's Challenges",
          'The Art of Effective Communication in Leadership',
          'Exploring the Benefits of Meditation and Mindfulness',
          'Data Privacy: What You Need to Know in 2024',
          'The Future of Electric Vehicles and Transportation',
          'Cooking Healthy Meals on a Budget: Practical Tips',
          'The Impact of Social Media on Modern Relationships',
          'Career Development: Skills for the Future Workforce',
          'Understanding the Gig Economy: Pros and Cons',
          'Home Organization Hacks for a Clutter-Free Life',
          'The Role of Renewable Energy in Fighting Climate Change',
        ].slice(0, amount);
      }

      const completion = await this.openai.chat.completions.create({
        model: 'o4-mini-2025-04-16',
        messages: [
          {
            role: 'system',
            content: BLOG_TOPICS_PROMPT,
          },
          {
            role: 'user',
            content: `Please generate a list of  ${amount} blog topics based on the following keywords: ${keywords.join(', ')}`,
          },
        ],
      });

      const response = JSON.parse(
        completion.choices[0]?.message?.content ||
          '{"blogTopics": ["blogTopic1", "blogTopic2", "blogTopic3"]}',
      ) as { blogTopics: string[] };

      return response.blogTopics;
    } catch {
      throw new HttpException(
        'Failed to generate blog topics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
