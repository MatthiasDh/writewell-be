import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClerkClientProvider } from '../../providers/clerk.provider';
import { OrganizationsService } from '../organizations/organizations.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ClerkClientProvider, OrganizationsService],
  exports: [UsersService],
})
export class UsersModule {}
