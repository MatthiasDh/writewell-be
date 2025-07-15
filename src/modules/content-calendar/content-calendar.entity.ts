import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { ContentItem } from '../content-items/content-item.entity';
import { Keyword } from '../keywords/keyword.entity';

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

  @ManyToMany(() => Keyword)
  @JoinTable({
    name: 'content_calendar_keywords',
  })
  keywords: Keyword[];
}
