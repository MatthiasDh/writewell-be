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
import { ContentItem } from './content-item.entity';
import { Organization } from '@clerk/backend';

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

  @Column({ type: 'uuid' })
  organizationId: string;

  @OneToMany(() => ContentItem, (contentItem) => contentItem.contentCalendar)
  contentItems: ContentItem[];
}
