# Database Restructuring Plan

## Overview

This document outlines the changes required to restructure the database by removing outdated tables and implementing a new schema structure.

## Current State Analysis

### Tables/Entities to Remove:

1. **keywords** table (`src/modules/keywords/keyword.entity.ts`)
   - Contains: keyword, search_volume, cpc, competition, etc.
   - Related to: content_calendars via many-to-many relationship

2. **content_calendars** table (`src/modules/content-calendar/content-calendar.entity.ts`)
   - Contains: name, description, organizationId
   - Related to: content_items (one-to-many), keywords (many-to-many)

3. **content_items** table (`src/modules/content-items/content-item.entity.ts`)
   - Currently related to content_calendars
   - Will be replaced by new structure

### Current User/Organization Handling:

- Users and organizations are currently managed through Clerk (external service)
- No database entities exist for users or organizations
- Need to create proper database entities for the new structure

## Actions to Take

### Phase 1: Remove Outdated Entities and Dependencies

#### 1.1 Remove Keywords Module

- [ ] Delete `src/modules/keywords/` directory (entity, service, controller, repository, DTOs)
- [ ] Remove keywords imports from other modules
- [ ] Remove keywords from `app.module.ts`
- [ ] Clean up any references in organizations service/controller

#### 1.2 Remove Content Calendar Module

- [ ] Delete `src/modules/content-calendar/` directory (entity, service, controller, repository, DTOs)
- [ ] Remove content calendar imports from other modules
- [ ] Remove content calendar from `app.module.ts`
- [ ] Clean up any references in organizations and content-items modules

#### 1.3 Remove Content Items Module

- [ ] Delete `src/modules/content-items/` directory (entity, service, controller, repository, DTOs)
- [ ] Remove content items imports from other modules
- [ ] Remove content items from `app.module.ts`

### Phase 2: Create New Database Entities

#### 2.1 Create Organizations Entity

```typescript
// src/modules/organizations/organization.entity.ts
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
```

#### 2.2 Create Users Entity

```typescript
// src/modules/users/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Clerk user ID',
    example: 'user_2abcdef123456789',
  })
  @Column({ unique: true, nullable: false })
  clerk_user_id: string;

  // Relationships
  @ApiProperty({
    description: 'Organizations this user belongs to',
    type: () => Organization,
    isArray: true,
  })
  @ManyToMany(() => Organization, (organization) => organization.users)
  @JoinTable({
    name: 'user_organizations',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'organization_id', referencedColumnName: 'id' },
  })
  organizations: Organization[];
}
```

#### 2.3 Create Organization Settings Entity

```typescript
// src/modules/organizations/organization-settings.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('organization_settings')
export class OrganizationSettings {
  @ApiProperty({
    description: 'Organization settings ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Organization ID',
    example: 1,
  })
  @Column()
  organization_id: number;

  @ApiProperty({
    description: 'Supported languages',
    example: ['en', 'es', 'fr'],
    nullable: true,
  })
  @Column('varchar', { array: true, nullable: true })
  languages: string[];

  @ApiProperty({
    description: 'Content tone',
    example: 'professional',
    nullable: true,
  })
  @Column({ nullable: true })
  tone: string;

  // Relationships
  @ApiProperty({
    description: 'Organization',
    type: () => Organization,
  })
  @OneToOne(() => Organization, (organization) => organization.settings)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
```

#### 2.4 Create Scheduled Content Items Entity

```typescript
// src/modules/content/scheduled-content-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Organization ID',
    example: 1,
  })
  @Column()
  organization_id: number;

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
```

#### 2.5 Create Blog Posts Entity

```typescript
// src/modules/content/blog-post.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('blog_posts')
export class BlogPost {
  @ApiProperty({
    description: 'Blog post ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

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
}
```

#### 2.6 Additional Considerations for Swagger

All entities include comprehensive Swagger annotations:

- `@ApiProperty()` decorators for all fields
- Descriptive text with examples
- Proper type definitions for relationships
- Enum documentation for status and type fields
- Nullable field indicators

DTOs should follow the same pattern:

```typescript
// Example DTO with Swagger annotations
export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Organization name',
    example: 'Acme Corp',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Organization description',
    example: 'Leading provider of innovative solutions',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Target audience segments',
    example: ['small businesses', 'enterprise clients'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  target_audience?: string[];
}
```

### Phase 3: Update Database Configuration

#### 3.1 Update init-db.sql

- [ ] Add any necessary database setup for new tables
- [ ] Add indexes for performance
- [ ] Add constraints for data integrity

#### 3.2 Update TypeORM Configuration

- [ ] Ensure new entities are included in `database.config.ts`
- [ ] Verify entity discovery patterns

### Phase 4: Update Modules and Services

#### 4.1 Update Organizations Module

- [ ] Add organization entity to module imports
- [ ] Create organization repository
- [ ] Update organization service to use database entity alongside Clerk
- [ ] Update organization controller as needed

#### 4.2 Update Users Module

- [ ] Add user entity to module imports
- [ ] Create user repository
- [ ] Update user service to use database entity alongside Clerk
- [ ] Update user controller as needed

#### 4.3 Create New Content Module

- [ ] Create new content module for scheduled content items and blog posts
- [ ] Create repositories for new entities
- [ ] Create services for content management
- [ ] Create controllers for API endpoints
- [ ] Create DTOs for requests/responses with Swagger annotations

### Phase 5: Update App Module

- [ ] Remove old module imports (keywords, content-calendar, content-items)
- [ ] Add new module imports
- [ ] Ensure proper dependency injection

### Phase 6: Testing and Validation

- [ ] Test all new endpoints
- [ ] Verify database constraints work properly
- [ ] Test relationships between entities
- [ ] Ensure proper error handling

## Files to be Created

1. `src/modules/organizations/organization.entity.ts`
2. `src/modules/organizations/organization-settings.entity.ts`
3. `src/modules/organizations/organization.repository.ts`
4. `src/modules/users/user.entity.ts`
5. `src/modules/users/user.repository.ts`
6. `src/modules/content/scheduled-content-item.entity.ts`
7. `src/modules/content/blog-post.entity.ts`
8. `src/modules/content/content.module.ts`
9. `src/modules/content/content.service.ts`
10. `src/modules/content/content.controller.ts`
11. `src/modules/content/content.repository.ts`
12. Various DTOs for new entities

## Files to be Modified

1. `src/modules/app/app.module.ts`
2. `src/modules/organizations/organizations.module.ts`
3. `src/modules/organizations/organizations.service.ts`
4. `src/modules/users/users.module.ts`
5. `src/modules/users/users.service.ts`
6. `src/config/database.config.ts`
7. `init-db.sql`

## Files to be Deleted

1. `src/modules/keywords/` (entire directory)
2. `src/modules/content-calendar/` (entire directory)
3. `src/modules/content-items/` (entire directory)

## Database Schema After Changes

### Tables:

- `organizations` (id, clerk_organization_id, name, description, domain, target_audience, example_blog_post_urls)
- `users` (id, clerk_user_id)
- `organization_settings` (id, organization_id, languages, tone)
- `scheduled_content_items` (id, organization_id, scheduled_date, status, prompt, type, content_type, content_sub_type, metadata, blog_post_id)
- `blog_posts` (id, title, body, tags, created_at, updated_at)
- `user_organizations` (user_id, organization_id) - join table

### Relationships:

- Organizations 1:1 Organization Settings
- Organizations 1:Many Scheduled Content Items
- Users M:M Organizations
- Scheduled Content Items 1:1 Blog Posts

## Risk Assessment

- **High**: Removing existing entities will break current functionality
- **Medium**: New relationship structure needs careful implementation
- **Low**: Database migration should be straightforward

## Rollback Plan

- Keep backup of current database structure
- Implement feature flags for gradual rollout
- Maintain parallel endpoints during transition if needed

## Next Steps

1. Review and approve this plan
2. Create feature branch for changes
3. Execute Phase 1 (removal of old entities)
4. Execute Phase 2 (creation of new entities)
5. Continue with remaining phases
6. Test thoroughly before production deployment
