import { getRepositoryToken } from '@nestjs/typeorm';
import { Followers } from 'src/followers/follwers.entity';
import { Instruments } from 'src/instruments/instruments.entity';
import { Users } from 'src/users/users.entity';

export const REPOSITORY_TOKEN = {
  USERS: getRepositoryToken(Users),
  FOLLOWERS: getRepositoryToken(Followers),
  INSTRUMENT: getRepositoryToken(Instruments),
};
