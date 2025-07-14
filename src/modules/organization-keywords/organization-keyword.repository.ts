import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '../../common/base.repository';
import { OrganizationKeyword } from './organization-keywords.entity';
import { Keyword } from '../keywords/keyword.entity';

@Injectable()
export class OrganizationKeywordRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async create(
    organizationId: string,
    keywordId: string,
  ): Promise<OrganizationKeyword> {
    const repository = this.getRepository(OrganizationKeyword);
    const organizationKeyword = repository.create({
      organizationId,
      keyword: { id: keywordId },
      created_at: new Date(),
      updated_at: new Date(),
    });

    return repository.save(organizationKeyword);
  }

  async createMultiple(
    organizationId: string,
    keywords: Keyword[],
  ): Promise<OrganizationKeyword[]> {
    const repository = this.getRepository(OrganizationKeyword);
    const organizationKeywords = repository.create(
      keywords.map((keyword) => ({
        organizationId,
        keyword,
        created_at: new Date(),
        updated_at: new Date(),
      })),
    );

    return repository.save(organizationKeywords);
  }

  async findAll(): Promise<OrganizationKeyword[]> {
    const repository = this.getRepository(OrganizationKeyword);
    return repository.find({
      relations: ['keyword'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<OrganizationKeyword | null> {
    const repository = this.getRepository(OrganizationKeyword);
    return repository.findOne({
      where: { id },
      relations: ['keyword'],
    });
  }

  async findByOrganization(
    organizationId: string,
  ): Promise<OrganizationKeyword[]> {
    const repository = this.getRepository(OrganizationKeyword);
    return repository.find({
      where: { organizationId },
      relations: ['keyword'],
      order: { created_at: 'DESC' },
    });
  }

  async findByKeyword(keywordId: string): Promise<OrganizationKeyword[]> {
    const repository = this.getRepository(OrganizationKeyword);
    return repository.find({
      where: { keyword: { id: keywordId } },
      relations: ['keyword'],
      order: { created_at: 'DESC' },
    });
  }

  async findByOrganizationAndKeyword(
    organizationId: string,
    keywordId: string,
  ): Promise<OrganizationKeyword | null> {
    const repository = this.getRepository(OrganizationKeyword);
    return repository.findOne({
      where: { organizationId, keyword: { id: keywordId } },
      relations: ['keyword'],
    });
  }

  async remove(id: string): Promise<void> {
    const repository = this.getRepository(OrganizationKeyword);
    await repository.delete(id);
  }

  async removeByOrganizationAndKeyword(
    organizationId: string,
    keywordId: string,
  ): Promise<void> {
    const repository = this.getRepository(OrganizationKeyword);
    await repository.delete({ organizationId, keyword: { id: keywordId } });
  }

  async removeAllByOrganization(organizationId: string): Promise<void> {
    const repository = this.getRepository(OrganizationKeyword);
    await repository.delete({ organizationId });
  }

  async removeAllByKeyword(keywordId: string): Promise<void> {
    const repository = this.getRepository(OrganizationKeyword);
    await repository.delete({ keyword: { id: keywordId } });
  }

  async bulkCreate(
    organizationKeywords: Array<{
      organizationId: string;
      keywordId: string;
    }>,
  ): Promise<OrganizationKeyword[]> {
    const repository = this.getRepository(OrganizationKeyword);
    const keywordRepository = this.getRepository(Keyword);

    const entities: OrganizationKeyword[] = [];
    for (const orgKeyword of organizationKeywords) {
      const keyword = await keywordRepository.findOne({
        where: { id: orgKeyword.keywordId },
      });
      if (keyword) {
        entities.push(
          repository.create({
            organizationId: orgKeyword.organizationId,
            keyword,
          }),
        );
      }
    }

    return repository.save(entities);
  }

  async getKeywordCountByOrganization(organizationId: string): Promise<number> {
    const repository = this.getRepository(OrganizationKeyword);
    return repository.count({
      where: { organizationId },
    });
  }
}
