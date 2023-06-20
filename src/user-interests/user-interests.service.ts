import { UserInterestsRepository } from './user-interests.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserInterestsService {
  constructor(private userInterestsRepository: UserInterestsRepository) {}
}
