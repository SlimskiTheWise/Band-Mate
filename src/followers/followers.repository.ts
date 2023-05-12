import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Followers } from './follwers.entity';

@Injectable()
export class FollowersRepository {
  constructor(
    @InjectRepository(FollowersRepository)
    private followersRepository: Repository<Followers>,
  ) {}
}
