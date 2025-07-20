import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { Public } from 'src/decorators/public.decorator';
import {
  Webhook,
  WebhookRequiredHeaders,
  WebhookUnbrandedRequiredHeaders,
} from 'svix';
import { ConfigService } from '@nestjs/config';
import { UserJSON } from '@clerk/backend';
import { UsersService } from '../users/users.service';

@Controller()
@Public()
export class AppController {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  @Get('/health')
  healthCheck(): string {
    return 'OK';
  }

  @Post('/webhook')
  async webhook(@Req() request: RawBodyRequest<Request>, @Res() res: Response) {
    try {
      const wh = new Webhook(
        this.configService.get('CLERK_WEBHOOK_SIGNING_SECRET') as string,
      );

      const payload = request?.rawBody?.toString('utf8') as string;
      const headers = request.headers as
        | WebhookRequiredHeaders
        | WebhookUnbrandedRequiredHeaders
        | Record<string, string>;

      const evt = wh.verify(payload, headers) as {
        data: UserJSON;
        type: 'user.created' | 'user.updated';
      };

      switch (evt?.type) {
        case 'user.created':
          await this.usersService.create(evt.data);

          break;
        case 'user.updated':
          const user = await this.usersService.getUserByClerkId(evt.data.id);

          // If the user is not found, create a new user
          if (!user) {
            await this.usersService.create(evt.data);

            return;
          }

          await this.usersService.update(user.id, {
            first_name: evt.data.first_name || undefined,
            last_name: evt.data.last_name || undefined,
            email_address:
              evt.data.email_addresses?.[0]?.email_address || undefined,
            image_url: evt.data.image_url || undefined,
          });
          break;
        default:
          break;
      }

      return res.send('Webhook received');
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return res.status(HttpStatus.NOT_FOUND);
    }
  }
}
