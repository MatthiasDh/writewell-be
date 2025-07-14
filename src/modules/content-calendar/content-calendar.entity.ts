import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContentItem } from '../../entities/content-item.entity';
import { ContentCalendarKeyword } from '../content-calendar-keywords/content-calendar-keyword.entity';

@Entity('content_calendars')
export class ContentCalendar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar' })
  organizationId: string;

  @OneToMany(() => ContentItem, (contentItem) => contentItem.contentCalendar)
  contentItems: ContentItem[];

  @OneToMany(
    () => ContentCalendarKeyword,
    (contentCalendarKeyword) => contentCalendarKeyword.contentCalendar,
  )
  keywords: ContentCalendarKeyword[];
}
