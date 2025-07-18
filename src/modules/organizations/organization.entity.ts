import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationSettings } from '../organization-settings/organization-settings.entity';
import { ScheduledContentItem } from '../scheduled-content-items/scheduled-content-item.entity';
import { User } from '../users/user.entity';

@Entity('organizations')
export class Organization {
  @ApiProperty({
    description: 'Organization ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Clerk organization ID',
    example: 'org_2abcdef123456789',
  })
  @Column({ unique: true, nullable: false })
  clerk_organization_id: string;

  @ApiProperty({
    description: 'Organization name',
    example: 'Acme Corp',
  })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({
    description: 'Organization description',
    example: 'Leading provider of innovative solutions',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Organization domain',
    example: 'acmecorp.com',
    nullable: true,
  })
  @Column({ nullable: true })
  domain: string;

  @ApiProperty({
    description: 'Target audience segments',
    example: ['small businesses', 'enterprise clients'],
    nullable: true,
  })
  @Column('varchar', { array: true, nullable: true })
  target_audience: string[];

  @ApiProperty({
    description: 'Example blog post URLs for reference',
    example: [
      'https://acmecorp.com/blog/post1',
      'https://acmecorp.com/blog/post2',
    ],
    nullable: true,
  })
  @Column('varchar', { array: true, nullable: true })
  example_blog_post_urls: string[];

  // Relationships
  @ApiProperty({
    description: 'Organization settings',
    type: () => OrganizationSettings,
  })
  @OneToOne(() => OrganizationSettings, (settings) => settings.organization)
  settings: OrganizationSettings;

  @ApiProperty({
    description: 'Scheduled content items',
    type: () => ScheduledContentItem,
    isArray: true,
  })
  @OneToMany(() => ScheduledContentItem, (item) => item.organization)
  scheduled_content_items: ScheduledContentItem[];

  @ApiProperty({
    description: 'Users belonging to this organization',
    type: () => User,
    isArray: true,
  })
  @ManyToMany(() => User, (user) => user.organizations)
  @JoinTable({
    name: 'user_organizations',
    joinColumn: { name: 'organization_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  users: User[];
}
