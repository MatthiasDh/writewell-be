import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContentCalendar } from './content-calendar.entity';

export enum ContentType {
  BLOG = 'blog',
  SOCIAL_POST = 'social_post',
}

@Entity('content_items')
export class ContentItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ContentType })
  type: ContentType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamp' })
  publishDate: Date;

  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ContentCalendar, (calendar) => calendar.contentItems)
  @JoinColumn({ name: 'content_calendar_id' })
  contentCalendar: ContentCalendar;
}
