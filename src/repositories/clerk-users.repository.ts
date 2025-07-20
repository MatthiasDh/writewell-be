import { Injectable, Inject } from '@nestjs/common';
import { ClerkClient } from '@clerk/backend';

@Injectable()
export class ClerkUsersRepository {
  constructor(
    @Inject('ClerkClient')
    private readonly clerkClient: ClerkClient,
  ) {}

  async getUser(userId: string) {
    return this.clerkClient.users.getUser(userId);
  }

  async updateUser(userId: string, params: any) {
    return this.clerkClient.users.updateUser(userId, params);
  }
}
