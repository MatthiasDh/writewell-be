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

  async findAll(): Promise<BlogPost[]> {
    return this.blogPostsRepository.findAll();
  }

  async findOne(id: number): Promise<BlogPost> {
    return this.blogPostsRepository.findById(id);
  }

  async update(id: number, data: UpdateBlogPostDto): Promise<BlogPost> {
    return this.blogPostsRepository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    return this.blogPostsRepository.delete(id);
  }
}
