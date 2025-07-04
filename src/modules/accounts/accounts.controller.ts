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
} from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountResponseDto } from './dto/account-response.dto';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully',
    type: AccountResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBody({ type: CreateAccountDto })
  async create(@Body(ValidationPipe) createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiResponse({
    status: 200,
    description: 'List of accounts retrieved successfully',
    type: [AccountResponseDto],
  })
  async findAll() {
    return this.accountsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an account by ID' })
  @ApiParam({ name: 'id', description: 'Account ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Account retrieved successfully',
    type: AccountResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.accountsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get accounts by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Accounts retrieved successfully',
    type: [AccountResponseDto],
  })
  async findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.accountsService.findByUser(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an account' })
  @ApiParam({ name: 'id', description: 'Account ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Account updated successfully',
    type: AccountResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBody({ type: UpdateAccountDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an account' })
  @ApiParam({ name: 'id', description: 'Account ID', type: 'string' })
  @ApiResponse({
    status: 204,
    description: 'Account deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.accountsService.remove(id);
  }

  @Post(':id/keywords')
  @ApiOperation({ summary: 'Add keywords to account' })
  @ApiParam({ name: 'id', description: 'Account ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Keywords added successfully',
    type: AccountResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        keywords: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  async addKeywords(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('keywords') keywords: string[],
  ) {
    return this.accountsService.addKeywords(id, keywords);
  }

  @Delete(':id/keywords')
  @ApiOperation({ summary: 'Remove keywords from account' })
  @ApiParam({ name: 'id', description: 'Account ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Keywords removed successfully',
    type: AccountResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        keywords: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  async removeKeywords(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('keywords') keywords: string[],
  ) {
    return this.accountsService.removeKeywords(id, keywords);
  }
}
