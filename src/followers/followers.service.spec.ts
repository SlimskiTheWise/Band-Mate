import { Test, TestingModule } from '@nestjs/testing';
import { FollowersService } from './followers.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { REPOSITORY_TOKEN } from 'src/test/repository-token';
import { FollowersRepository } from './followers.repository';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';
import { UtilsService } from 'src/utils/utils.service';
import { seedSingleUser } from 'src/test/mock-data/user-mock-data';

describe('FollowersService', () => {
  let follwersService: FollowersService;
  let followersRepository: FollowersRepository;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
      ],
      providers: [
        FollowersService,
        UsersService,
        {
          provide: REPOSITORY_TOKEN.FOLLOWERS,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: FollowersRepository,
          useValue: {
            createFollower: jest.fn(),
          },
        },
        {
          provide: REPOSITORY_TOKEN.USERS,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            findOneById: jest.fn(),
          },
        },
        {
          provide: UtilsService,
          useValue: {
            encrypt: jest.fn(),
            compare: jest.fn(),
          },
        },
      ],
    }).compile();

    follwersService = module.get<FollowersService>(FollowersService);
    usersService = module.get<UsersService>(UsersService);
    followersRepository = module.get<FollowersRepository>(FollowersRepository);
  });

  it('should be defined', () => {
    expect(follwersService).toBeDefined();
    expect(followersRepository).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('creating follower', () => {
    const userId = 1;
    const followedUserId = 2;
    const user = seedSingleUser();
    it('should create a follower', async () => {
      user.id = followedUserId;
      jest.spyOn(usersService, 'findOneById').mockResolvedValue(user);
      await follwersService.createFollower(userId, followedUserId);

      expect(usersService.findOneById).toBeCalledTimes(1);
      expect(usersService.findOneById).toBeCalledWith(followedUserId);
      expect(followersRepository.createFollower).toBeCalledTimes(1);
      expect(followersRepository.createFollower).toBeCalledWith(
        userId,
        followedUserId,
      );
    });

    it('should throw an error when user does not exist', async () => {
      jest.spyOn(usersService, 'findOneById').mockResolvedValue(undefined);

      expect(
        follwersService.createFollower(userId, followedUserId),
      ).rejects.toThrowError();
    });
  });
});
