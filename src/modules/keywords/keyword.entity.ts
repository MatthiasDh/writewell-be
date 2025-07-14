import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ContentCalendarKeyword } from '../content-calendar-keywords/content-calendar-keyword.entity';

@Entity('keywords')
export class Keyword {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  keyword: string;

  @Column('int')
  search_volume: number;

  @Column('decimal', { precision: 10, scale: 2 })
  cpc: number;

  @Column()
  competition: string;

  @Column('int')
  competition_index: number;

  @Column('decimal', { precision: 10, scale: 2 })
  low_top_of_page_bid: number;

  @Column('decimal', { precision: 10, scale: 2 })
  high_top_of_page_bid: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(
    () => ContentCalendarKeyword,
    (contentCalendarKeyword) => contentCalendarKeyword.keyword,
  )
  contentCalendars: ContentCalendarKeyword[];

  @UpdateDateColumn()
  updated_at: Date;
}
