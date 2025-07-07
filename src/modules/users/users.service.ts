import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Tenant } from '../../entities/tenant.entity';
import { SignUpUserDto } from '../auth/dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async create(createUserDto: SignUpUserDto): Promise<User> {
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
      select: {
        password: true,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

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
    const tenant = await this.tenantRepository.findOne({
      where: { id: accountId },
    });

    if (!tenant) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }

    if (!user.tenants) {
      user.tenants = [];
    }

    const isAlreadyAssociated = user.tenants.some(
      (tenant) => tenant.id === accountId,
    );
    if (!isAlreadyAssociated) {
      user.tenants.push(tenant);
      await this.userRepository.save(user);
    }

    return this.findOne(userId);
  }

  async removeAccountFromUser(
    userId: string,
    accountId: string,
  ): Promise<User> {
    const user = await this.findOne(userId);

    if (user.tenants) {
      user.tenants = user.tenants.filter((tenant) => tenant.id !== accountId);
      await this.userRepository.save(user);
    }

    return this.findOne(userId);
  }
}
