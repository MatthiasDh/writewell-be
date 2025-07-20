import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from '../organizations/organization.entity';
import { BlogPost } from '../blog-posts/blog-post.entity';

export enum ContentStatus {
  PLANNED = 'planned',
  GENERATED = 'generated',
  PUBLISHED = 'published',
}

export enum ContentType {
  BLOG = 'blog',
  SOCIAL = 'social',
  EMAIL = 'email',
}

@Entity('scheduled_content_items')
export class ScheduledContentItem {
  @ApiProperty({
    description: 'Scheduled content item ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Organization ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column()
  organization_id: string;

  @ApiProperty({
    description: 'Scheduled date',
    example: '2024-01-15',
  })
  @Column({ type: 'date', nullable: false })
  scheduled_date: Date;

  @ApiProperty({
    description: 'Content status',
    enum: ContentStatus,
    example: ContentStatus.PLANNED,
  })
  @Column({ type: 'enum', enum: ContentStatus, nullable: false })
  status: ContentStatus;

  @ApiProperty({
    description: 'Content generation prompt',
    example: 'Write a blog post about AI trends in 2024',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  prompt: string;

  @ApiProperty({
    description: 'Content type',
    enum: ContentType,
    example: ContentType.BLOG,
  })
  @Column({ type: 'enum', enum: ContentType, nullable: false })
  type: ContentType;

  @ApiProperty({
    description: 'Content sub-type',
    example: 'how-to-guide',
    nullable: true,
  })
  @Column({ nullable: true })
  content_type: string;

  @ApiProperty({
    description: 'Content sub-type variation',
    example: 'beginner-friendly',
    nullable: true,
  })
  @Column({ nullable: true })
  content_sub_type: string;

  @ApiProperty({
    description: 'Metadata for content optimization',
    example: { search_volume: 1200, difficulty: 45, cpc: 2.5 },
    nullable: true,
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  // Relationships
  @ApiProperty({
    description: 'Organization',
    type: () => Organization,
  })
  @ManyToOne(
    () => Organization,
    (organization) => organization.scheduled_content_items,
  )
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ApiProperty({
    description: 'Associated blog post',
    type: () => BlogPost,
    nullable: true,
  })
  @OneToOne(() => BlogPost, (blogPost) => blogPost.scheduled_content_item, {
    nullable: true,
  })
  @JoinColumn({ name: 'blog_post_id' })
  blog_post: BlogPost;
}
