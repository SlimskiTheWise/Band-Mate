import { Injectable } from '@nestjs/common';
import { FollowersRepository } from './followers.repository';

@Injectable()
export class FollowersService {
  constructor(private followersRepository: FollowersRepository) {}
}
