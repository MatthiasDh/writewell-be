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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Get('email/:email')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by email' })
  @ApiParam({ name: 'email', description: 'User email', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.remove(id);
  }

  @Post(':userId/accounts/:accountId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add account to user' })
  @ApiParam({ name: 'userId', description: 'User ID', type: 'string' })
  @ApiParam({ name: 'accountId', description: 'Account ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Account added to user successfully',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User or account not found' })
  async addAccountToUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('accountId', ParseUUIDPipe) accountId: string,
  ) {
    return this.usersService.addAccountToUser(userId, accountId);
  }

  @Delete(':userId/accounts/:accountId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove account from user' })
  @ApiParam({ name: 'userId', description: 'User ID', type: 'string' })
  @ApiParam({ name: 'accountId', description: 'Account ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Account removed from user successfully',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async removeAccountFromUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('accountId', ParseUUIDPipe) accountId: string,
  ) {
    return this.usersService.removeAccountFromUser(userId, accountId);
  }
}
