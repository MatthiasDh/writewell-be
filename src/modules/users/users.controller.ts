import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateUserDto: any,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  // Database CRUD operations for User
  @Post('/database')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a database user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  async createDatabaseUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.createDatabaseUser(createUserDto);
  }

  @Get('/database')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all database users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [User],
  })
  async getAllDatabaseUsers(): Promise<User[]> {
    return this.usersService.getAllDatabaseUsers();
  }

  @Get('/database/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a database user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: User,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getDatabaseUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User | null> {
    return this.usersService.getDatabaseUserById(id);
  }

  @Get('/database/clerk/:clerkId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a database user by Clerk ID' })
  @ApiParam({ name: 'clerkId', description: 'Clerk user ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: User,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getDatabaseUserByClerkId(
    @Param('clerkId') clerkId: string,
  ): Promise<User | null> {
    return this.usersService.getDatabaseUserByClerkId(clerkId);
  }

  @Patch('/database/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a database user' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async updateDatabaseUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateDatabaseUser(id, updateUserDto);
  }

  @Delete('/database/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a database user' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async deleteDatabaseUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.usersService.deleteDatabaseUser(id);
  }
}
