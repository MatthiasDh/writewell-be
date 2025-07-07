import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataForSEOService } from '../../common/services/dataforseo.service';
import { OpenAIService } from '../../common/services/openai.service';
import { PuppeteerService } from '../../common/services/puppeteer.service';

// Import new modules
import { UsersModule } from '../users/users.module';
import { TenantsModule } from '../tenants/tenants.module';
import { ContentCalendarModule } from '../content-calendar/content-calendar.module';
import { ContentItemsModule } from '../content-items/content-items.module';
import { AuthModule } from '../auth/auth.module';

import { getDatabaseConfig } from '../../config/database.config';
import { AuthService } from '../auth/auth.service';

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
    TenantsModule,
    ContentCalendarModule,
    ContentItemsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PuppeteerService,
    OpenAIService,
    DataForSEOService,
    AuthService,
  ],
})
export class AppModule {}
