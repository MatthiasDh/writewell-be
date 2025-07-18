import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationSettingsController } from './organization-settings.controller';
import { OrganizationSettingsService } from './organization-settings.service';
import { OrganizationSettings } from './organization-settings.entity';
import { OrganizationSettingsRepository } from './organization-settings.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationSettings])],
  controllers: [OrganizationSettingsController],
  providers: [OrganizationSettingsService, OrganizationSettingsRepository],
  exports: [
    OrganizationSettingsService,
    OrganizationSettingsRepository,
    TypeOrmModule,
  ],
})
export class OrganizationSettingsModule {}
