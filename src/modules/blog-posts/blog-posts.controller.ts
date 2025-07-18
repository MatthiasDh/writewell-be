import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { BlogPostsService } from './blog-posts.service';
import { BlogPost } from './blog-post.entity';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto';

@ApiTags('blog-posts')
@Controller('blog-posts')
export class BlogPostsController {
  constructor(private readonly blogPostsService: BlogPostsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a blog post' })
  @ApiResponse({
    status: 201,
    description: 'The blog post has been created successfully.',
    type: BlogPost,
  })
  async create(
    @Body(ValidationPipe) data: CreateBlogPostDto,
  ): Promise<BlogPost> {
    return this.blogPostsService.create(data);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all blog posts' })
  @ApiResponse({
    status: 200,
    description: 'List of all blog posts.',
    type: [BlogPost],
  })
  async findAll(): Promise<BlogPost[]> {
    return this.blogPostsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a blog post by ID' })
  @ApiParam({ name: 'id', description: 'Blog post ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The blog post details.',
    type: BlogPost,
  })
  @ApiNotFoundResponse({ description: 'Blog post not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<BlogPost> {
    return this.blogPostsService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a blog post' })
  @ApiParam({ name: 'id', description: 'Blog post ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The blog post has been updated successfully.',
    type: BlogPost,
  })
  @ApiNotFoundResponse({ description: 'Blog post not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) data: UpdateBlogPostDto,
  ): Promise<BlogPost> {
    return this.blogPostsService.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiParam({ name: 'id', description: 'Blog post ID', type: 'number' })
  @ApiResponse({
    status: 204,
    description: 'The blog post has been deleted successfully.',
  })
  @ApiNotFoundResponse({ description: 'Blog post not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.blogPostsService.remove(id);
  }
}
