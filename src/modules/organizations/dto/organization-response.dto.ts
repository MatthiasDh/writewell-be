import { ApiProperty } from '@nestjs/swagger';
import { ContentCalendarResponseDto } from '../../content-calendar/dto/content-calendar-response.dto';

export class OrganizationResponseDto {
  @ApiProperty({
    description: 'Organization ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Organization title',
    example: 'My Company',
  })
  title: string;

  @ApiProperty({
    description: 'Organization description',
    example: 'A leading technology company',
  })
  description: string;

  @ApiProperty({
    description: 'Content calendars associated with the organization',
    type: [ContentCalendarResponseDto],
  })
  contentCalendars: ContentCalendarResponseDto[];

  @ApiProperty({
    description: 'Organization creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Organization last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
