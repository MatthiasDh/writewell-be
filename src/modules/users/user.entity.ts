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
