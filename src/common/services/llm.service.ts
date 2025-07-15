import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { z } from 'zod';
import {
  BUSINESS_RELEVANT_KEYWORDS_MOCKUP,
  BUSINESS_SUMMARY_MOCKUP,
} from '../mockup/business-summary.mockup';

@Injectable()
export class LLMService {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      temperature: 0.7,
      modelName: 'gpt-4o-mini',
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getBusinessDescription(shortInput: string): Promise<{
    title: string;
    summary: string;
  }> {
    if (process.env.NODE_ENV === 'development') {
      return BUSINESS_SUMMARY_MOCKUP;
    }

    const schema = z.object({
      title: z.string().describe('A title for the business description'),
      summary: z.string().describe('A detailed business description'),
    });

    const messages = [
      new SystemMessage('You are a helpful marketing copywriter assistant.'),
      new HumanMessage(
        `Write a detailed business description for: ${shortInput}.`,
      ),
    ];

    const res = await this.model.withStructuredOutput(schema).invoke(messages);

    return res;
  }

  async getBusinessKeywords(description: string): Promise<string[]> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return BUSINESS_RELEVANT_KEYWORDS_MOCKUP.keywords;
      }

      const schema = z.object({
        keywords: z.array(z.string().describe('A list of SEO keywords')),
      });

      const messages = [
        new SystemMessage(
          `You are an expert SEO strategist with deep knowledge of keyword research and searcher intent.`,
        ),
        new HumanMessage(
          `Read the following business description and generate a list of 15 highly relevant, multi-word (2–5 words each) SEO keyword phrases.`,
        ),
        new HumanMessage(description),
      ];

      const res = await this.model
        .withStructuredOutput(schema)
        .invoke(messages);

      return res.keywords;
    } catch (error) {
      throw new HttpException(
        'Failed to get business keywords',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getContentTopics(
    keywords: string[],
    amount: number,
  ): Promise<string[]> {
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

    const schema = z.object({
      topics: z.array(z.string()),
    });

    const messages = [
      new SystemMessage(
        'You are an expert SEO strategist and content marketing specialist.',
      ),
      new HumanMessage(
        `Read the following list of SEO keywords and generate ${amount} relevant blog post topics. For each topic, provide a compelling headline`,
      ),
      new HumanMessage(keywords.join(', ')),
    ];

    const res = await this.model.withStructuredOutput(schema).invoke(messages);

    return res.topics;
  }
}
