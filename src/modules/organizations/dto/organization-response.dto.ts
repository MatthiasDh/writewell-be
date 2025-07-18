import { ApiProperty } from '@nestjs/swagger';
import { ScheduledContentItem } from '../../scheduled-content-items/scheduled-content-item.entity';
import { OrganizationSettings } from '../../organization-settings/organization-settings.entity';

export class OrganizationResponseDto {
  @ApiProperty({
    description: 'Organization ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Organization name',
    example: 'My Company',
  })
  name: string;

  @ApiProperty({
    description: 'Organization description',
    example: 'A leading technology company',
  })
  description: string;

  @ApiProperty({
    description: 'Organization domain',
    example: 'mycompany.com',
  })
  domain: string;

  @ApiProperty({
    description: 'Target audience segments',
    example: ['small businesses', 'enterprise clients'],
  })
  target_audience: string[];

  @ApiProperty({
    description: 'Example blog post URLs',
    example: ['https://mycompany.com/blog/post1'],
  })
  example_blog_post_urls: string[];

  @ApiProperty({
    description: 'Organization settings',
    type: OrganizationSettings,
  })
  settings: OrganizationSettings;

  @ApiProperty({
    description: 'Scheduled content items',
    type: [ScheduledContentItem],
  })
  scheduled_content_items: ScheduledContentItem[];
}
