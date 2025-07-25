import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ScheduledContentItem } from '../scheduled-content-items/scheduled-content-item.entity';
import { Organization } from '../organizations/organization.entity';

@Entity('blog_posts')
export class BlogPost {
  @ApiProperty({
    description: 'Blog post ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Blog post title',
    example: 'AI Trends in 2024: What to Expect',
  })
  @Column({ nullable: false })
  title: string;

  @ApiProperty({
    description: 'Blog post content',
    example: 'In 2024, we can expect significant advances in AI technology...',
  })
  @Column({ type: 'text', nullable: false })
  body: string;

  @ApiProperty({
    description: 'Blog post tags',
    example: ['AI', 'technology', 'trends', '2024'],
    nullable: true,
  })
  @Column('varchar', { array: true, nullable: true })
  tags: string[];

  @ApiProperty({
    description: 'Blog post creation date',
    example: '2024-01-15T10:00:00.000Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'Blog post last update date',
    example: '2024-01-15T10:00:00.000Z',
  })
  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ApiProperty({
    description: 'Associated scheduled content item',
    type: () => ScheduledContentItem,
  })
  @OneToOne(() => ScheduledContentItem, (item) => item.blog_post)
  scheduled_content_item: ScheduledContentItem;

  @ApiProperty({
    description: 'Organization that owns this blog post',
    type: () => Organization,
  })
  @ManyToOne(() => Organization, (organization) => organization.blog_posts)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ApiProperty({
    description: 'Organization ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column({ nullable: false })
  organization_id: string;
}
