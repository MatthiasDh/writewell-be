import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ContentCalendar } from '../content-calendar/content-calendar.entity';
import { Keyword } from '../keywords/keyword.entity';

@Entity('content_calendar_keywords')
@Unique(['contentCalendar', 'keyword'])
export class ContentCalendarKeyword {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => ContentCalendar,
    (contentCalendar) => contentCalendar.keywords,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'contentCalendarId' })
  contentCalendar: ContentCalendar;

  @ManyToOne(() => Keyword, (keyword) => keyword.contentCalendars, {
    eager: true,
  })
  @JoinColumn({ name: 'keywordId' })
  keyword: Keyword;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
