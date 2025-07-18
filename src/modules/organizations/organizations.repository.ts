import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';

@Injectable()
export class OrganizationsRepository {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async create(data: Partial<Organization>): Promise<Organization> {
    const organization = this.organizationRepository.create(data);
    return this.organizationRepository.save(organization);
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationRepository.find({
      relations: ['settings', 'scheduled_content_items', 'users'],
    });
  }

  async findById(id: number): Promise<Organization | null> {
    return this.organizationRepository.findOne({
      where: { id },
      relations: ['settings', 'scheduled_content_items', 'users'],
    });
  }

  async findByClerkId(clerkId: string): Promise<Organization | null> {
    return this.organizationRepository.findOne({
      where: { clerk_organization_id: clerkId },
      relations: ['settings', 'scheduled_content_items', 'users'],
    });
  }

  async update(id: number, data: Partial<Organization>): Promise<Organization> {
    await this.organizationRepository.update(id, data);
    const result = await this.organizationRepository.findOne({
      where: { id },
      relations: ['settings', 'scheduled_content_items', 'users'],
    });
    if (!result) {
      throw new Error(`Organization with id ${id} not found`);
    }
    return result;
  }

  async delete(id: number): Promise<void> {
    await this.organizationRepository.delete(id);
  }

  async deleteByClerkId(clerkId: string): Promise<void> {
    await this.organizationRepository.delete({
      clerk_organization_id: clerkId,
    });
  }
}
