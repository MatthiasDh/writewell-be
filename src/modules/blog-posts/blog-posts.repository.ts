import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './blog-post.entity';

@Injectable()
export class BlogPostsRepository {
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogPostRepository: Repository<BlogPost>,
  ) {}

  async create(data: Partial<BlogPost>): Promise<BlogPost> {
    const blogPost = this.blogPostRepository.create(data);
    return this.blogPostRepository.save(blogPost);
  }

  async findAllByOrganizationId(organizationId: string): Promise<BlogPost[]> {
    return this.blogPostRepository.find({
      where: { organization_id: organizationId },
      relations: ['scheduled_content_item'],
    });
  }

  async findById(id: string): Promise<BlogPost> {
    const result = await this.blogPostRepository.findOne({
      where: { id },
      relations: ['scheduled_content_item'],
    });
    if (!result) {
      throw new Error(`Blog post with id ${id} not found`);
    }
    return result;
  }

  async update(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    await this.blogPostRepository.update(id, data);
    const result = await this.blogPostRepository.findOne({
      where: { id },
      relations: ['scheduled_content_item'],
    });
    if (!result) {
      throw new Error(`Blog post with id ${id} not found`);
    }
    return result;
  }
}
