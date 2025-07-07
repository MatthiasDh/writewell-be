import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../entities/tenant.entity';
import { ContentCalendar } from '../../entities/content-calendar.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(ContentCalendar)
    private readonly contentCalendarRepository: Repository<ContentCalendar>,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    try {
      const tenant = this.tenantRepository.create(createTenantDto);
      const savedTenant = await this.tenantRepository.save(tenant);

      // Create a default content calendar for the account
      const contentCalendar = this.contentCalendarRepository.create({
        name: `${savedTenant.title} Content Calendar`,
        description: `Default content calendar for ${savedTenant.title}`,
        tenant: savedTenant,
      });

      await this.contentCalendarRepository.save(contentCalendar);

      return this.findOne(savedTenant.id);
    } catch {
      throw new HttpException(
        'Failed to create tenant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(userId: string): Promise<Tenant[]> {
    return this.tenantRepository.find({
      where: {
        users: {
          id: userId,
        },
      },
      relations: ['users'],
    });
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { id },
      relations: ['users', 'contentCalendar'],
    });

    if (!tenant) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }

    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);

    Object.assign(tenant, updateTenantDto);

    await this.tenantRepository.save(tenant);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const tenant = await this.findOne(id);
    await this.tenantRepository.remove(tenant);
  }

  async findByUser(userId: string): Promise<Tenant[]> {
    return this.tenantRepository.find({
      where: {
        users: {
          id: userId,
        },
      },
      relations: ['users', 'contentCalendar'],
    });
  }

  async addKeywords(id: string, keywords: string[]): Promise<Tenant> {
    const tenant = await this.findOne(id);

    if (!tenant.relevantKeywords) {
      tenant.relevantKeywords = [];
    }

    const newKeywords = keywords.filter(
      (keyword) => !tenant.relevantKeywords.includes(keyword),
    );

    tenant.relevantKeywords = [...tenant.relevantKeywords, ...newKeywords];
    await this.tenantRepository.save(tenant);

    return this.findOne(id);
  }

  async removeKeywords(id: string, keywords: string[]): Promise<Tenant> {
    const tenant = await this.findOne(id);

    if (tenant.relevantKeywords) {
      tenant.relevantKeywords = tenant.relevantKeywords.filter(
        (keyword) => !keywords.includes(keyword),
      );
      await this.tenantRepository.save(tenant);
    }

    return this.findOne(id);
  }
}
