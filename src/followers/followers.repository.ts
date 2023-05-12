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
}
