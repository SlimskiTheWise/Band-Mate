import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserInterests } from './user-interests.entity';
import { Type } from './type.enum';

@Injectable()
export class UserInterestsRepository {
  constructor(
    @InjectRepository(UserInterests)
    private userInterestsRepository: Repository<UserInterests>,
    private dataSource: DataSource,
  ) {}

  async createUserInterests(types: Type[], userId: number) {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(UserInterests)
      .values(
        types.map((type) => ({
          type,
          userId,
        })),
      )
      .execute();
  }
}
