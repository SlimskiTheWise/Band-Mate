import { Injectable, NotFoundException } from '@nestjs/common';
import { FollowersRepository } from './followers.repository';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FollowersService {
  constructor(
    private followersRepository: FollowersRepository,
    private usersService: UsersService,
  ) {}

  async createFollower(userId: number, followedUserId: number) {
    const userExists = await this.usersService.findOneById(followedUserId);
    if (!userExists) throw new NotFoundException('user not found');
    await this.followersRepository.createFollower(userId, followedUserId);
  }

  async deleteFollower(userId: number, followedUserId: number) {
    await this.followersRepository.deleteFollower(userId, followedUserId);
  }
}
