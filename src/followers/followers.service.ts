import { Injectable } from '@nestjs/common';
import { FollowersRepository } from './followers.repository';

@Injectable()
export class FollowersService {
  constructor(private followersRepository: FollowersRepository) {}

  async createFollower(userId: number, followedUserId: number) {
    await this.followersRepository.createFollower(userId, followedUserId);
  }

  async deleteFollower(id: number) {
    await this.followersRepository.deleteFollower(id);
  }
}
