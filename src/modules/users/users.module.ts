import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClerkClientProvider } from '../../providers/clerk.provider';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ClerkClientProvider],
  exports: [UsersService],
})
export class UsersModule {}
