import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Account } from '../../entities/account.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.CONFLICT,
        );
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      const savedUser = await this.userRepository.save(user);

      // Associate with accounts if provided
      if (createUserDto.accountIds && createUserDto.accountIds.length > 0) {
        const accounts = await this.accountRepository.findBy({
          id: In(createUserDto.accountIds),
        });

        if (accounts.length !== createUserDto.accountIds.length) {
          throw new HttpException(
            'Some accounts not found',
            HttpStatus.NOT_FOUND,
          );
        }

        savedUser.accounts = accounts;
        await this.userRepository.save(savedUser);
      }

      return this.findOne(savedUser.id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['accounts'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['accounts'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['accounts'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Associate with accounts if provided
    if (updateUserDto.accountIds && updateUserDto.accountIds.length > 0) {
      const accounts = await this.accountRepository.findBy({
        id: In(updateUserDto.accountIds),
      });

      if (accounts.length !== updateUserDto.accountIds.length) {
        throw new HttpException(
          'Some accounts not found',
          HttpStatus.NOT_FOUND,
        );
      }

      user.accounts = accounts;
    }

    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async addAccountToUser(userId: string, accountId: string): Promise<User> {
    const user = await this.findOne(userId);
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    if (!user.accounts) {
      user.accounts = [];
    }

    const isAlreadyAssociated = user.accounts.some(
      (acc) => acc.id === accountId,
    );
    if (!isAlreadyAssociated) {
      user.accounts.push(account);
      await this.userRepository.save(user);
    }

    return this.findOne(userId);
  }

  async removeAccountFromUser(
    userId: string,
    accountId: string,
  ): Promise<User> {
    const user = await this.findOne(userId);

    if (user.accounts) {
      user.accounts = user.accounts.filter((acc) => acc.id !== accountId);
      await this.userRepository.save(user);
    }

    return this.findOne(userId);
  }
}
