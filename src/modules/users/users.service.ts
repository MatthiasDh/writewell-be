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
      relations: ['tenants'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['tenants'],
    });

    if (!user) {
      throw new Error();
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['tenants'],
      select: {
        id: true,
        email: true,
        password: true,
        refreshToken: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error();
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
      relations: ['users'],
    });

    if (!tenant) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }

    if (!tenant.users) {
      tenant.users = [];
    }

    const isAlreadyAssociated = tenant.users.some((user) => user.id === userId);

    if (!isAlreadyAssociated) {
      tenant.users.push(user);
      await this.tenantRepository.save(tenant);
    }

    return this.findOne(userId);
  }

  async removeAccountFromUser(
    userId: string,
    accountId: string,
  ): Promise<User> {
    const tenant = await this.tenantRepository.findOne({
      where: { id: accountId },
      relations: ['users'],
    });

    if (!tenant) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }

    if (tenant.users) {
      tenant.users = tenant.users.filter((user) => user.id !== userId);
      await this.tenantRepository.save(tenant);
    }

    return this.findOne(userId);
  }
}
