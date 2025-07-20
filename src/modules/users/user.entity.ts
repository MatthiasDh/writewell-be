import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from '../organizations/organization.entity';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Clerk user ID',
    example: 'user_2abcdef123456789',
  })
  @Column({ unique: true, nullable: false })
  clerk_user_id: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @Column({ nullable: true })
  first_name: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @Column({ nullable: true })
  last_name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @Column({ nullable: true })
  email_address: string;

  @ApiProperty({
    description: 'User profile image URL',
    example: 'https://example.com/profile.jpg',
  })
  @Column({ nullable: true })
  image_url: string;

  // Relationships
  @ApiProperty({
    description: 'Organizations this user belongs to',
    type: () => Organization,
    isArray: true,
  })
  @ManyToMany(() => Organization, (organization) => organization.users)
  organizations: Organization[];
}
