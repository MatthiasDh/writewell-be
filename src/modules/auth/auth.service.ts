import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

import { UsersService } from '../users/users.service';
import { AuthSuccessObject } from './auth.types';
import { SignUpUserDto } from './dto/signup-user.dto';
import { JWTUser } from '../../types/auth.type';
import { TenantsService } from '../tenants/tenants.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tenantsService: TenantsService,
  ) {}

  async signUp(signUpUserDto: SignUpUserDto): Promise<AuthSuccessObject> {
    const user = await this.usersService.create(signUpUserDto);

    // Create default tenant for the user
    const tenant = await this.tenantsService.create({
      title: 'Default',
      description: 'Default tenant for the user',
      relevantKeywords: [],
    });

    await this.usersService.update(user.id, {
      tenants: [tenant.id],
    });

    const tokens = await this.getTokens(user.id, user.email, tenant.id);
    await this.storeRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async login(email: string, pass: string): Promise<AuthSuccessObject> {
    const user = await this.usersService.findByEmail(email);
    const tenantId = user.tenants[0].id;

    if (!user?.password || !(await compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.getTokens(user.id, user.email, tenantId);
    await this.storeRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async getTokens(uuid: string, email: string, tenantId: string) {
    const payload = {
      sub: uuid,
      email: email,
      ...(tenantId && { tenantId }),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires: Math.floor(new Date().getTime() / 1000) + 3600,
    };
  }

  async storeRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hash(refreshToken, 10);

    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async logout(userId: string) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  async getNewTokensFromRefreshToken(
    refreshToken: string,
  ): Promise<AuthSuccessObject> {
    const decoded = this.jwtService.decode<JWTUser>(refreshToken);

    if (!decoded) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findOne(decoded.sub);

    if (!user) {
      throw new NotFoundException('Could not find a user with this id');
    }

    const isRefreshTokenMatching = await compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.getTokens(
      decoded.sub,
      decoded.email,
      decoded.tenantId,
    );

    await this.storeRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }
}
