import { Test, TestingModule } from '@nestjs/testing';
import { FollowersService } from './followers.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { REPOSITORY_TOKEN } from 'src/test/repository-token';
import { FollowersRepository } from './followers.repository';

describe('FollowersService', () => {
  let follwersService: FollowersService;
  let followersRepository: FollowersRepository;

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
          useValue: {},
        },
      ],
    }).compile();

    follwersService = module.get<FollowersService>(FollowersService);
    followersRepository = module.get<FollowersRepository>(FollowersRepository);
  });

  it('should be defined', () => {
    expect(follwersService).toBeDefined();
    expect(followersRepository).toBeDefined();
  });
});
