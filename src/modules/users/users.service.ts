import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserJSON } from '@clerk/backend';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async getUserByClerkId(clerkId: string): Promise<User | null> {
    return this.usersRepository.findByClerkId(clerkId);
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return this.usersRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.usersRepository.delete(id);
  }

  async create(userData: UserJSON): Promise<User> {
    const createUserDto: CreateUserDto = {
      clerk_user_id: userData.id,
      first_name: userData.first_name || undefined,
      last_name: userData.last_name || undefined,
      email_address: userData.email_addresses?.[0]?.email_address || undefined,
      image_url: userData.image_url || undefined,
    };

    return this.usersRepository.create(createUserDto);
  }
}
