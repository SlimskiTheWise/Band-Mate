import { Type } from './type.enum';
import { UserInterestsRepository } from './user-interests.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserInterestsService {
  constructor(private userInterestsRepository: UserInterestsRepository) {}

  async createUserInterests(types: Type[], userId: number) {
    await this.userInterestsRepository.createUserInterests(types, userId);
  }
}
