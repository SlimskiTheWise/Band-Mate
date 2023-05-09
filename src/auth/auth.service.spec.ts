import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { UtilsService } from 'src/utils/utils.service';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';

describe('AuthService', () => {
  const USER_REPO_TOKEN = getRepositoryToken(Users);

  let authService: AuthService;
  let utilsService: UtilsService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let usersRepository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
      ],
      providers: [
        AuthService,
        UsersService,
        {
          provide: USER_REPO_TOKEN,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            decode: jest.fn(),
            sign: jest.fn(),
          },
        },
        {
          provide: UtilsService,
          useValue: {
            encrypt: jest.fn(),
            compare: jest.fn(),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            findOne: jest.fn(),
            signUp: jest.fn(),
            register: jest.fn(),
            saveRefreshToken: jest.fn(),
            revokeRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    utilsService = module.get<UtilsService>(UtilsService);
    jwtService = module.get<JwtService>(JwtService);
    usersRepository = module.get<Repository<Users>>(USER_REPO_TOKEN);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validate user', () => {
    it('should succeed validating user', async () => {
      const email = 'test@test.com';
      const password = '123456';

      const user = new Users();

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      jest.spyOn(utilsService, 'compare').mockResolvedValue(true);
      const result = await authService.validateUser(email, password);

      expect(result).toBe(user);
    });

    it('should fail validating user when user does not exist', async () => {
      const email = 'test@test.com';
      const password = '123456';

      jest.spyOn(usersService, 'findOne').mockResolvedValue(undefined);

      expect(authService.validateUser(email, password)).rejects.toThrowError();
    });

    it('should fail validating when password is not matching', async () => {
      const email = 'test@test.com';
      const password = '123456';

      const user = new Users();
      user.email = email;
      user.password = '121212';

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      jest.spyOn(utilsService, 'compare').mockResolvedValue(false);

      expect(authService.validateUser(email, password)).rejects.toThrowError();
    });
  });
});
