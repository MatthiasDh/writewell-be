import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPostsController } from './blog-posts.controller';
import { BlogPostsService } from './blog-posts.service';
import { BlogPost } from './blog-post.entity';
import { BlogPostsRepository } from './blog-posts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost])],
  controllers: [BlogPostsController],
  providers: [BlogPostsService, BlogPostsRepository],
  exports: [BlogPostsService, BlogPostsRepository, TypeOrmModule],
})
export class BlogPostsModule {}
