import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ToolsController } from '../tools/tools.controller';
import { DataForSEOService } from '../../common/services/dataforseo.service';
import { OpenAIService } from '../../common/services/openai.service';
import { PuppeteerService } from '../../common/services/puppeteer.service';

// Import new modules
import { UsersModule } from '../users/users.module';
import { AccountsModule } from '../accounts/accounts.module';
import { ContentCalendarModule } from '../content-calendar/content-calendar.module';
import { ContentItemsModule } from '../content-items/content-items.module';

// Import entities
import { User } from '../../entities/user.entity';
import { Account } from '../../entities/account.entity';
import { ContentCalendar } from '../../entities/content-calendar.entity';
import { ContentItem } from '../../entities/content-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev', '.env.prod'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'writewell',
      entities: [User, Account, ContentCalendar, ContentItem],
      synchronize: process.env.NODE_ENV !== 'production', // Only for development
      logging: process.env.NODE_ENV === 'development',
    }),
    UsersModule,
    AccountsModule,
    ContentCalendarModule,
    ContentItemsModule,
  ],
  controllers: [AppController, ToolsController],
  providers: [AppService, PuppeteerService, OpenAIService, DataForSEOService],
})
export class AppModule {}
