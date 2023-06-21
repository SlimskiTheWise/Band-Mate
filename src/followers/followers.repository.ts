import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Followers } from './follwers.entity';

@Injectable()
export class FollowersRepository {
  constructor(
    @InjectRepository(Followers)
    private followersRepository: Repository<Followers>,
  ) {}

  async createFollower(userId: number, followedUserId: number) {
    await this.followersRepository.save({
      followingUserId: userId,
      followedUserId,
    });
  }

  async deleteFollower(id: number) {
    await this.followersRepository.delete(id);
  }

  async countFollowingAndFollowersById(userId: number) {
    const followers = await this.followersRepository.countBy({
      followedUserId: userId,
    });

    const following = await this.followersRepository.countBy({
      followingUserId: userId,
    });

    return { followers, following };
  }
}
