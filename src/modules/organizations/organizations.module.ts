import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { Organization } from './organization.entity';
import { OrganizationsRepository } from './organizations.repository';
import { ClerkOrganizationsRepository } from '../../repositories/clerk-organizations.repository';
import { ClerkUsersRepository } from '../../repositories/clerk-users.repository';
import { ClerkClientProvider } from '../../providers/clerk.provider';
import { User } from '../users/user.entity';
import { PuppeteerService } from '../../common/services/puppeteer.service';
import { LLMService } from '../../common/services/llm.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User]), UsersModule],
  controllers: [OrganizationsController],
  providers: [
    OrganizationsService,
    OrganizationsRepository,
    ClerkOrganizationsRepository,
    ClerkUsersRepository,
    PuppeteerService,
    LLMService,
    ClerkClientProvider,
  ],
  exports: [OrganizationsService, OrganizationsRepository, TypeOrmModule],
})
export class OrganizationsModule {}
