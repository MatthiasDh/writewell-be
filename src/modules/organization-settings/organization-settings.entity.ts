import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from '../organizations/organization.entity';

@Entity('organization_settings')
export class OrganizationSettings {
  @ApiProperty({
    description: 'Organization settings ID',
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
