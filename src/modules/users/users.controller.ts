import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseUUIDPipe,
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
import { UpdateUserDto } from './dto';
import { User } from './user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('/current')
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
    return this.usersService.update(id, updateUserDto);
  }

  @Get('/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users', operationId: 'getUsers' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [User],
  })
  async getAll(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by ID', operationId: 'getUser' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: User,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<User | null> {
    return this.usersService.getUserById(id);
  }
}
