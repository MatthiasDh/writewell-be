import { ClerkClient, User, verifyToken } from '@clerk/backend';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { UsersService } from '@modules/users/users.service';
import { Request } from 'express';
import { UserWithOrg } from './auth.types';

@Injectable()
export class ClerkStrategy extends PassportStrategy(Strategy, 'clerk') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  async validate(req: Request): Promise<UserWithOrg> {
    const token = req.headers.authorization?.split(' ').pop();

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const tokenPayload = await verifyToken(token, {
        secretKey: this.configService.get('CLERK_SECRET_KEY'),
      });

      const user = await this.usersService.getUserByClerkId(tokenPayload.sub);

      return { ...user, orgId: tokenPayload.org_id } as UserWithOrg;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
