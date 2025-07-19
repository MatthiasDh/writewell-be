import { Injectable, Inject } from '@nestjs/common';
import { ClerkClient } from '@clerk/backend';
import { UpdateUserParams } from './users.type';

@Injectable()
export class ClerkUsersRepository {
  constructor(
    @Inject('ClerkClient')
    private readonly clerkClient: ClerkClient,
  ) {}

  async getUser(userId: string) {
    return this.clerkClient.users.getUser(userId);
  }

  async updateUser(userId: string, params: UpdateUserParams) {
    return this.clerkClient.users.updateUser(userId, params);
  }
}
