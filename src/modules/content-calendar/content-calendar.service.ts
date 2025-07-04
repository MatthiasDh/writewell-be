import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentCalendar } from '../../entities/content-calendar.entity';
import { Account } from '../../entities/account.entity';
import { CreateContentCalendarDto } from './dto/create-content-calendar.dto';
import { UpdateContentCalendarDto } from './dto/update-content-calendar.dto';

@Injectable()
export class ContentCalendarService {
  constructor(
    @InjectRepository(ContentCalendar)
    private readonly contentCalendarRepository: Repository<ContentCalendar>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(
    createContentCalendarDto: CreateContentCalendarDto,
  ): Promise<ContentCalendar> {
    try {
      const account = await this.accountRepository.findOne({
        where: { id: createContentCalendarDto.accountId },
      });

      if (!account) {
        throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
      }

      // Check if account already has a content calendar
      const existingCalendar = await this.contentCalendarRepository.findOne({
        where: { account: { id: createContentCalendarDto.accountId } },
      });

      if (existingCalendar) {
        throw new HttpException(
          'Account already has a content calendar',
          HttpStatus.CONFLICT,
        );
      }

      const contentCalendar = this.contentCalendarRepository.create({
        name: createContentCalendarDto.name,
        description: createContentCalendarDto.description,
        account,
      });

      const savedCalendar =
        await this.contentCalendarRepository.save(contentCalendar);
      return this.findOne(savedCalendar.id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create content calendar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<ContentCalendar[]> {
    return this.contentCalendarRepository.find({
      relations: ['account', 'contentItems'],
    });
  }

  async findOne(id: string): Promise<ContentCalendar> {
    const contentCalendar = await this.contentCalendarRepository.findOne({
      where: { id },
      relations: ['account', 'contentItems'],
    });

    if (!contentCalendar) {
      throw new HttpException(
        'Content calendar not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return contentCalendar;
  }

  async findByAccount(accountId: string): Promise<ContentCalendar | null> {
    return this.contentCalendarRepository.findOne({
      where: { account: { id: accountId } },
      relations: ['account', 'contentItems'],
    });
  }

  async update(
    id: string,
    updateContentCalendarDto: UpdateContentCalendarDto,
  ): Promise<ContentCalendar> {
    const contentCalendar = await this.findOne(id);

    Object.assign(contentCalendar, updateContentCalendarDto);
    await this.contentCalendarRepository.save(contentCalendar);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const contentCalendar = await this.findOne(id);
    await this.contentCalendarRepository.remove(contentCalendar);
  }

  async findByUser(userId: string): Promise<ContentCalendar[]> {
    return this.contentCalendarRepository.find({
      where: {
        account: {
          users: {
            id: userId,
          },
        },
      },
      relations: ['account', 'contentItems'],
    });
  }
}
