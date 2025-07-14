import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { ClerkStrategy } from './clerk.strategy';
import { ClerkClientProvider } from '../../providers/clerk.provider';

@Module({
  imports: [PassportModule, UsersModule, ConfigModule],
  providers: [ClerkStrategy, ClerkClientProvider],
  exports: [PassportModule],
})
export class AuthModule {}
