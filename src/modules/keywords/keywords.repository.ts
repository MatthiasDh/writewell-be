import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { DataSource, In } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from '../../common/base.repository';
import { Keyword } from './keyword.entity';

@Injectable()
export class KeywordRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async create(
    keywordData: Partial<Omit<Keyword, 'id' | 'created_at' | 'updated_at'>>,
  ): Promise<Keyword> {
    const repository = this.getRepository(Keyword);
    const keyword = repository.create(keywordData);

    return repository.save(keyword);
  }

  async createMultiple(
    keywordsData: Omit<Keyword, 'id' | 'created_at' | 'updated_at'>[],
  ): Promise<Keyword[]> {
    const repository = this.getRepository(Keyword);
    const keywords = repository.create(keywordsData);

    return repository.save(keywords);
  }

  async findAll(): Promise<Keyword[]> {
    const repository = this.getRepository(Keyword);
    return repository.find({
      order: { search_volume: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Keyword | null> {
    const repository = this.getRepository(Keyword);
    return repository.findOne({
      where: { id },
    });
  }

  async findMultiple(keywords: string[]): Promise<Keyword[]> {
    const repository = this.getRepository(Keyword);
    return repository.find({
      where: { keyword: In(keywords) },
    });
  }

  async findByKeyword(keyword: string): Promise<Keyword | null> {
    const repository = this.getRepository(Keyword);
    return repository.findOne({
      where: { keyword },
    });
  }
}
