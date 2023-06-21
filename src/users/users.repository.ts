import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { FollowersRepository } from 'src/followers/followers.repository';
import { UsersCountsResponse } from './responses/users-counts.dto';
import { UsersProfileResponse } from './responses/user-profile.response';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private followersRepository: FollowersRepository,
  ) {}

  async signUp(body: SignupDto) {
    return this.usersRepository.save(body);
  }

  async findOneByEmail(email: string): Promise<Users> {
    return this.usersRepository.findOneBy({ email });
  }

  async findOneById(id: number): Promise<Users> {
    return this.usersRepository.findOneBy({ id });
  }

  async saveRefreshToken(userId: number, refresh_token: string) {
    await this.usersRepository.update(userId, { refreshToken: refresh_token });
  }

  async revokeRefreshToken(userId: number) {
    await this.usersRepository.update(userId, { refreshToken: '' });
  }

  async findOneByUsername(username: string): Promise<Users> {
    return this.usersRepository.findOneBy({ username });
  }

  async updateLastLogin(userId: number) {
    return this.usersRepository.update(userId, { lastLogin: new Date() });
  }

  async getUsersCounts(): Promise<UsersCountsResponse> {
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);

    const totalUsers = await this.usersRepository.count();

    const usersJoinedThisMonth = await this.usersRepository.count({
      where: {
        createdAt: MoreThanOrEqual(
          new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        ),
      },
    });

    const activeUsers = await this.usersRepository.count({
      where: {
        lastLogin: MoreThanOrEqual(thirtyDaysAgo),
      },
    });

    return { totalUsers, usersJoinedThisMonth, activeUsers };
  }

  async passwordReset(id: number, hashedPassword: string): Promise<void> {
    await this.usersRepository.update(id, { password: hashedPassword });
  }

  async getUserProfileById(userId: number): Promise<UsersProfileResponse> {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.instruments', 'instruments')
      .leftJoinAndSelect('users.userInterests', 'userInterests')
      .where('users.id = :userId', { userId })
      .select([
        'users.id',
        'users.username',
        'users.name',
        'users.role',
        'users.profilePictureUrl',
        'users.bio',
        'userInterests.type',
        'instruments.id',
        'instruments.title',
        'instruments.description',
        'instruments.price',
        'instruments.type',
      ])
      .getOne();
    const follwersAndFollowing =
      await this.followersRepository.countFollowingAndFollowersById(userId);

    const userInterests = user.userInterests.map((interest) => interest.type);

    return { ...user, follwersAndFollowing, userInterests };
  }

  async updateProfilePicture(userId: number, key: string) {
    this.usersRepository.update(userId, { profilePictureUrl: key });
  }
}
