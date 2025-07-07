import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload, JWTUser } from '../types/auth.type';
import { Request } from 'express';

// Custom interface extending Express Request
interface AuthenticatedRequest extends Request {
  currentUser?: JWTUser;
}

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request.currentUser = payload.user || (payload as unknown as JWTUser);
    } catch (error) {
      console.log('JWT verification error:', error);
      throw new UnauthorizedException('Invalid token');
    }

    return next.handle();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
