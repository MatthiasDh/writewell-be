import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ContentCalendar } from '../content-calendar/content-calendar.entity';

export enum ContentType {
  BLOG = 'blog',
  SOCIAL_POST = 'social_post',
}

@Entity('content_items')
export class ContentItem {
  @ApiProperty({
    description: 'Content item ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Content item type',
    enum: ContentType,
    example: ContentType.BLOG,
  })
  @Column({ type: 'enum', enum: ContentType })
  type: ContentType;

  @ApiProperty({
    description: 'Content item title',
    example: '10 Tips for Better SEO',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Content item content',
    example: 'Here are 10 tips to improve your SEO...',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  content: string;

  @ApiProperty({
    description: 'Content item publish date',
    example: '2024-01-15T10:00:00.000Z',
  })
  @Column({ type: 'timestamp' })
  publishDate: Date;

  @ApiProperty({
    description: 'Whether the content item is published',
    example: false,
  })
  @Column({ default: false })
  isPublished: boolean;

  @ApiProperty({
    description: 'Content item creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Content item last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Content calendar that owns this item',
    type: () => ContentCalendar,
  })
  @ManyToOne(() => ContentCalendar, (calendar) => calendar.contentItems)
  @JoinColumn({ name: 'content_calendar_id' })
  contentCalendar: ContentCalendar;
}
