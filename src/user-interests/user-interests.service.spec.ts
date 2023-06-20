import { UserInterestsRepository } from './user-interests.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UserInterestsService } from './user-interests.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';

describe('UserInterestsService', () => {
  let userInterestsService: UserInterestsService;
  let userInterestsRepository: UserInterestsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
      ],
      providers: [
        UserInterestsService,
        {
          provide: UserInterestsRepository,
          useValue: {},
        },
      ],
    }).compile();

    userInterestsService =
      module.get<UserInterestsService>(UserInterestsService);
    userInterestsRepository = module.get<UserInterestsRepository>(
      UserInterestsRepository,
    );
  });

  it('should be defined', () => {
    expect(userInterestsService).toBeDefined();
    expect(userInterestsRepository).toBeDefined();
  });
});
