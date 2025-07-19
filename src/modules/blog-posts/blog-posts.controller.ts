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

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all blog posts',
    operationId: 'getBlogPosts',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all blog posts.',
    type: [BlogPost],
  })
  async findAllByOrganizationId(
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ): Promise<BlogPost[]> {
    return this.blogPostsService.findAllByOrganizationId(organizationId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a blog post by ID',
    operationId: 'getBlogPost',
  })
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
  @ApiOperation({
    summary: 'Update a blog post',
    operationId: 'updateBlogPost',
  })
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
}
