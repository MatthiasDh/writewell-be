import { Injectable } from '@nestjs/common';
import { BlogPostsRepository } from './blog-posts.repository';
import { BlogPost } from './blog-post.entity';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto';

@Injectable()
export class BlogPostsService {
  constructor(private readonly blogPostsRepository: BlogPostsRepository) {}

  async create(data: CreateBlogPostDto): Promise<BlogPost> {
    return this.blogPostsRepository.create(data);
  }

  async findAllByOrganizationId(organizationId: string): Promise<BlogPost[]> {
    return this.blogPostsRepository.findAllByOrganizationId(organizationId);
  }

  async findOne(id: string): Promise<BlogPost> {
    return this.blogPostsRepository.findById(id);
  }

  async update(id: string, data: UpdateBlogPostDto): Promise<BlogPost> {
    return this.blogPostsRepository.update(id, data);
  }
}
