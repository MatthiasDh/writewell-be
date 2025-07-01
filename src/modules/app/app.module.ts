import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ToolsController } from '../tools/tools.controller';
import { ToolsService } from '../tools/tools.service';
import { OpenAIService } from '../../common/services/openai.service';
import { DataForSEOService } from '../../common/services/dataforseo.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev', '.env.prod'],
      isGlobal: true,
    }),
  ],
  controllers: [AppController, ToolsController],
  providers: [AppService, ToolsService, OpenAIService, DataForSEOService],
})
export class AppModule {}
