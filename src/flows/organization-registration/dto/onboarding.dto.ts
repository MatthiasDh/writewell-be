import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OnboardingUserDataDto {
  @ApiProperty({
    description: 'User email addresses',
    example: ['user@example.com'],
  })
  @IsString({ each: true })
  @IsNotEmpty()
  emailAddress: string[];

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'User password',
    example: 'securePassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Additional user metadata',
    example: { role: 'admin', department: 'marketing' },
    required: false,
  })
  @IsObject()
  @IsOptional()
  publicMetadata?: Record<string, any>;

  @ApiProperty({
    description: 'Private user metadata',
    example: { permissions: ['read', 'write'] },
    required: false,
  })
  @IsObject()
  @IsOptional()
  privateMetadata?: Record<string, any>;
}

export class OnboardingFlowRequestDto {
  @ApiProperty({
    description: 'User data for account creation',
    type: OnboardingUserDataDto,
  })
  @ValidateNested()
  @Type(() => OnboardingUserDataDto)
  userData: OnboardingUserDataDto;

  @ApiProperty({
    description: 'Organization name',
    example: 'Acme Corporation',
  })
  @IsString()
  @IsNotEmpty()
  orgName: string;
}

export class OnboardingFlowResponseDto {
  @ApiProperty({
    description: 'Created user information',
    example: {
      id: 'user_123',
      emailAddress: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
    },
  })
  user: any;

  @ApiProperty({
    description: 'Created organization information',
    example: {
      id: 'org_456',
      name: 'Acme Corporation',
      slug: 'acme-corporation',
    },
  })
  organization: any;

  @ApiProperty({
    description: 'Created content calendar information',
    example: {
      id: 'cal_789',
      name: 'Acme Corporation Calendar',
      organizationId: 'org_456',
    },
  })
  contentCalendar: any;

  @ApiProperty({
    description: 'Initial content items created',
    example: [
      {
        id: 'item_001',
        title: 'Welcome Blog Post',
        type: 'BLOG',
        publishDate: '2024-01-15T10:00:00.000Z',
      },
    ],
  })
  initialContentItems: any[];
}

export class PartialOnboardingStepsDto {
  @ApiProperty({
    description: 'Whether to create a user',
    example: true,
    required: false,
  })
  @IsOptional()
  createUser?: boolean;

  @ApiProperty({
    description: 'Whether to create an organization',
    example: true,
    required: false,
  })
  @IsOptional()
  createOrganization?: boolean;

  @ApiProperty({
    description: 'Whether to create a content calendar',
    example: true,
    required: false,
  })
  @IsOptional()
  createCalendar?: boolean;

  @ApiProperty({
    description: 'Whether to seed initial content',
    example: true,
    required: false,
  })
  @IsOptional()
  seedContent?: boolean;
}

export class PartialOnboardingFlowRequestDto {
  @ApiProperty({
    description: 'User data for account creation',
    type: OnboardingUserDataDto,
  })
  @ValidateNested()
  @Type(() => OnboardingUserDataDto)
  userData: OnboardingUserDataDto;

  @ApiProperty({
    description: 'Organization name',
    example: 'Acme Corporation',
  })
  @IsString()
  @IsNotEmpty()
  orgName: string;

  @ApiProperty({
    description: 'Which steps to execute',
    type: PartialOnboardingStepsDto,
  })
  @ValidateNested()
  @Type(() => PartialOnboardingStepsDto)
  steps: PartialOnboardingStepsDto;
}
