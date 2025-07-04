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
import { Account } from './account.entity';
import { ContentItem } from './content-item.entity';

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

  @OneToOne(() => Account, (account) => account.contentCalendar)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @OneToMany(() => ContentItem, (contentItem) => contentItem.contentCalendar)
  contentItems: ContentItem[];
}
