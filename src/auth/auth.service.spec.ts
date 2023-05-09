import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { UtilsService } from 'src/utils/utils.service';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';
import { seedSingleUser } from 'src/test/mock-data/user-mock-data';
import { jwtData } from 'src/test/mock-data/jwt-mock-data';

describe('AuthService', () => {
  const USER_REPO_TOKEN = getRepositoryToken(Users);

  let authService: AuthService;
  let utilsService: UtilsService;
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
      const user = seedSingleUser();

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      jest.spyOn(utilsService, 'compare').mockResolvedValue(true);
      const result = await authService.validateUser(user.email, user.password);

      expect(result).toBe(user);
    });

    it('should fail validating user when user does not exist', async () => {
      const user = seedSingleUser();
      jest.spyOn(usersService, 'findOne').mockResolvedValue(undefined);

      expect(
        authService.validateUser(user.email, user.password),
      ).rejects.toThrowError();
    });

    it('should fail validating when password is not matching', async () => {
      const user = seedSingleUser();

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      jest.spyOn(utilsService, 'compare').mockResolvedValue(false);

      expect(
        authService.validateUser(user.email, user.password),
      ).rejects.toThrowError();
    });
  });

  describe('signin', () => {
    it('should succeed signing in', async () => {
      const user = seedSingleUser();

      jest
        .spyOn(authService, 'createAccessToken')
        .mockReturnValue(jwtData().accessToken);

      jest
        .spyOn(authService, 'createRefreshToken')
        .mockReturnValue(jwtData().refreshToken);

      jest.spyOn(usersService, 'saveRefreshToken').mockResolvedValue();

      const result = await authService.signIn(user);

      expect(result).toEqual({
        access_token: jwtData().accessToken,
        refresh_token: jwtData().refreshToken,
        user,
      });
    });
  });
});
