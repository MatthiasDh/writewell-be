import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { Account } from '../../entities/account.entity';
import { ContentCalendar } from '../../entities/content-calendar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, ContentCalendar])],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService, TypeOrmModule],
})
export class AccountsModule {}
