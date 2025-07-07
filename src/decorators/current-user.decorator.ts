import { ExecutionContext } from '@nestjs/common';

import { createParamDecorator } from '@nestjs/common';
import { JWTUser } from '../types/auth.type';
import { Request } from 'express';

type AuthenticatedRequest = Request & {
  currentUser?: JWTUser;
};

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): JWTUser | undefined => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    return request.currentUser;
  },
);
