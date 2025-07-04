import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../entities/account.entity';
import { ContentCalendar } from '../../entities/content-calendar.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(ContentCalendar)
    private readonly contentCalendarRepository: Repository<ContentCalendar>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    try {
      const account = this.accountRepository.create(createAccountDto);
      const savedAccount = await this.accountRepository.save(account);

      // Create a default content calendar for the account
      const contentCalendar = this.contentCalendarRepository.create({
        name: `${savedAccount.title} Content Calendar`,
        description: `Default content calendar for ${savedAccount.title}`,
        account: savedAccount,
      });

      await this.contentCalendarRepository.save(contentCalendar);

      return this.findOne(savedAccount.id);
    } catch {
      throw new HttpException(
        'Failed to create account',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Account[]> {
    return this.accountRepository.find({
      relations: ['users', 'contentCalendar'],
    });
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id },
      relations: ['users', 'contentCalendar'],
    });

    if (!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    return account;
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.findOne(id);

    Object.assign(account, updateAccountDto);
    await this.accountRepository.save(account);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const account = await this.findOne(id);
    await this.accountRepository.remove(account);
  }

  async findByUser(userId: string): Promise<Account[]> {
    return this.accountRepository.find({
      where: {
        users: {
          id: userId,
        },
      },
      relations: ['users', 'contentCalendar'],
    });
  }

  async addKeywords(id: string, keywords: string[]): Promise<Account> {
    const account = await this.findOne(id);

    if (!account.relevantKeywords) {
      account.relevantKeywords = [];
    }

    const newKeywords = keywords.filter(
      (keyword) => !account.relevantKeywords.includes(keyword),
    );

    account.relevantKeywords = [...account.relevantKeywords, ...newKeywords];
    await this.accountRepository.save(account);

    return this.findOne(id);
  }

  async removeKeywords(id: string, keywords: string[]): Promise<Account> {
    const account = await this.findOne(id);

    if (account.relevantKeywords) {
      account.relevantKeywords = account.relevantKeywords.filter(
        (keyword) => !keywords.includes(keyword),
      );
      await this.accountRepository.save(account);
    }

    return this.findOne(id);
  }
}
