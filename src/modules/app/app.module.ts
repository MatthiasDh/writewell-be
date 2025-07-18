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
import { AuthModule } from '../auth/auth.module';
import { OrganizationSettingsModule } from '../organization-settings/organization-settings.module';
import { ScheduledContentItemsModule } from '../scheduled-content-items/scheduled-content-items.module';
import { BlogPostsModule } from '../blog-posts/blog-posts.module';

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
    AuthModule,
    OrganizationSettingsModule,
    ScheduledContentItemsModule,
    BlogPostsModule,
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
