import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { ClerkStrategy } from './clerk.strategy';

@Module({
  imports: [PassportModule, UsersModule, ConfigModule],
  providers: [ClerkStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
