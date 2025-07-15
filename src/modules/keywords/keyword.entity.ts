import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { ContentCalendar } from '../content-calendar/content-calendar.entity';

@Entity('keywords')
export class Keyword {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  keyword: string;

  @Column('int', { nullable: true })
  search_volume?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  cpc?: number;

  @Column({ nullable: true })
  competition?: string;

  @Column('int', { nullable: true })
  competition_index?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  low_top_of_page_bid?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  high_top_of_page_bid?: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => ContentCalendar)
  contentCalendars: ContentCalendar[];

  @UpdateDateColumn()
  updated_at: Date;
}
