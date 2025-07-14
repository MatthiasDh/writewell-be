import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
  JoinColumn,
} from 'typeorm';
import { Keyword } from '../keywords/keyword.entity';

@Entity('organization_keywords')
@Unique(['organizationId', 'keyword'])
export class OrganizationKeyword {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  organizationId: string;

  @ManyToOne(() => Keyword, (keyword) => keyword.orgRelations, { eager: true })
  @JoinColumn({ name: 'keywordId' })
  keyword: Keyword;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
