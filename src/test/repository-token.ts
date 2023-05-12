import { getRepositoryToken } from '@nestjs/typeorm';
import { Followers } from 'src/followers/follwers.entity';
import { Users } from 'src/users/users.entity';

export const REPOSITORY_TOKEN = {
  USERS: getRepositoryToken(Users),
  FOLLOWERS: getRepositoryToken(Followers),
};
