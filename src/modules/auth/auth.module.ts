import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthJwtGuard } from './guard/auth-jwt.guard';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
  imports: [
    UsersModule,
    TenantsModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    { provide: APP_GUARD, useClass: AuthJwtGuard },
    UsersService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
