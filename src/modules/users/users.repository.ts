import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['organizations'],
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['organizations'],
    });
  }

  async findByClerkId(clerkId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { clerk_user_id: clerkId },
      relations: ['organizations'],
    });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    await this.userRepository.update(id, data);
    const result = await this.userRepository.findOne({
      where: { id },
      relations: ['organizations'],
    });
    if (!result) {
      throw new Error(`User with id ${id} not found`);
    }
    return result;
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async deleteByClerkId(clerkId: string): Promise<void> {
    await this.userRepository.delete({ clerk_user_id: clerkId });
  }
}
