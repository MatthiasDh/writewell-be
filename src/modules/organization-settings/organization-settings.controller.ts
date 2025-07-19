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
import { UpdateOrganizationSettingsDto } from './dto';

@ApiTags('organization-settings')
@Controller('organization-settings')
export class OrganizationSettingsController {
  constructor(
    private readonly organizationSettingsService: OrganizationSettingsService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'getOrganizationSettings' })
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
  @ApiOperation({
    summary: 'Update organization settings',
    operationId: 'updateOrganizationSettings',
  })
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
}
