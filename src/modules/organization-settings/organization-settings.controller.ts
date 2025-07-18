import {
  Controller,
  Get,
  Post,
  Patch,
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
import { OrganizationSettingsService } from './organization-settings.service';
import { OrganizationSettings } from './organization-settings.entity';
import {
  CreateOrganizationSettingsDto,
  UpdateOrganizationSettingsDto,
} from './dto';

@ApiTags('organization-settings')
@Controller('organization-settings')
export class OrganizationSettingsController {
  constructor(
    private readonly organizationSettingsService: OrganizationSettingsService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create organization settings' })
  @ApiResponse({
    status: 201,
    description: 'Organization settings created successfully',
    type: OrganizationSettings,
  })
  async create(
    @Body(ValidationPipe) createSettingsDto: CreateOrganizationSettingsDto,
  ): Promise<OrganizationSettings> {
    return this.organizationSettingsService.create(createSettingsDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all organization settings' })
  @ApiResponse({
    status: 200,
    description: 'Organization settings retrieved successfully',
    type: [OrganizationSettings],
  })
  async findAll(): Promise<OrganizationSettings[]> {
    return this.organizationSettingsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get organization settings by ID' })
  @ApiParam({ name: 'id', description: 'Settings ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Organization settings retrieved successfully',
    type: OrganizationSettings,
  })
  @ApiNotFoundResponse({ description: 'Organization settings not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrganizationSettings | null> {
    return this.organizationSettingsService.findOne(id);
  }

  @Get('organization/:organizationId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get organization settings by organization ID' })
  @ApiParam({
    name: 'organizationId',
    description: 'Organization ID',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization settings retrieved successfully',
    type: OrganizationSettings,
  })
  @ApiNotFoundResponse({ description: 'Organization settings not found' })
  async findByOrganizationId(
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ): Promise<OrganizationSettings | null> {
    return this.organizationSettingsService.findByOrganizationId(
      organizationId,
    );
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update organization settings' })
  @ApiParam({ name: 'id', description: 'Settings ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Organization settings updated successfully',
    type: OrganizationSettings,
  })
  @ApiNotFoundResponse({ description: 'Organization settings not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateSettingsDto: UpdateOrganizationSettingsDto,
  ): Promise<OrganizationSettings> {
    return this.organizationSettingsService.update(id, updateSettingsDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete organization settings' })
  @ApiParam({ name: 'id', description: 'Settings ID', type: 'number' })
  @ApiResponse({
    status: 204,
    description: 'Organization settings deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Organization settings not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.organizationSettingsService.remove(id);
  }
}
