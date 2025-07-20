import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import { ClerkUsersRepository } from '../../repositories/clerk-users.repository';
import { ClerkClientProvider } from '../../providers/clerk.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    ClerkUsersRepository,
    ClerkClientProvider,
  ],
  exports: [UsersService, UsersRepository, TypeOrmModule],
})
export class UsersModule {}
