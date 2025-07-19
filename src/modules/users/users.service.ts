import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { ClerkUsersRepository } from './clerk-users.repository';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import {
  CreateUserParams,
  UpdateUserParams,
  UserListParams,
} from './users.type';

@Injectable()
export class UsersService {
  constructor(
    private readonly clerkUsersRepository: ClerkUsersRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  // Clerk operations
  async getAllUsers(params: UserListParams) {
    return this.clerkUsersRepository.getAllUsers(params);
  }

  async getUser(userId: string) {
    return this.clerkUsersRepository.getUser(userId);
  }

  async createUser(params: CreateUserParams) {
    return this.clerkUsersRepository.createUser(params);
  }

  async updateUser(userId: string, params: UpdateUserParams) {
    return this.clerkUsersRepository.updateUser(userId, params);
  }

  async deleteUser(userId: string) {
    return this.clerkUsersRepository.deleteUser(userId);
  }

  // Database operations
  async createDatabaseUser(data: CreateUserDto): Promise<User> {
    return this.usersRepository.create(data);
  }

  async getAllDatabaseUsers(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async getDatabaseUserById(id: number): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async getDatabaseUserByClerkId(clerkId: string): Promise<User | null> {
    return this.usersRepository.findByClerkId(clerkId);
  }

  async updateDatabaseUser(id: number, data: UpdateUserDto): Promise<User> {
    return this.usersRepository.update(id, data);
  }

  async deleteDatabaseUser(id: number): Promise<void> {
    return this.usersRepository.delete(id);
  }

  async deleteDatabaseUserByClerkId(clerkId: string): Promise<void> {
    return this.usersRepository.deleteByClerkId(clerkId);
  }
}
