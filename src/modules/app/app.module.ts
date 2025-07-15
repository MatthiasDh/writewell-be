import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataForSEOService } from '../../common/services/dataforseo.service';
import { PuppeteerService } from '../../common/services/puppeteer.service';

// Import new modules
import { UsersModule } from '../users/users.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { ContentCalendarModule } from '../content-calendar/content-calendar.module';
import { ContentItemsModule } from '../content-items/content-items.module';
import { AuthModule } from '../auth/auth.module';
import { KeywordModule } from '../keywords/keywords.module';

import { getDatabaseConfig } from '../../config/database.config';
import { ClerkClientProvider } from '../../providers/clerk.provider';
import { APP_GUARD } from '@nestjs/core';
import { ClerkAuthGuard } from '../auth/guard/clerck-auth.guard';
import { LLMService } from '../../common/services/llm.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev', '.env.prod'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    UsersModule,
    OrganizationsModule,
    ContentCalendarModule,
    ContentItemsModule,
    AuthModule,
    KeywordModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PuppeteerService,
    DataForSEOService,
    LLMService,
    ClerkClientProvider,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
})
export class AppModule {}
