import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { JwtService } from '@nestjs/jwt';
import { UtilsService } from 'src/utils/utils.service';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';
import { seedSingleUser } from 'src/test/mock-data/user-mock-data';
import { jwtData } from 'src/test/mock-data/jwt-mock-data';
import { REPOSITORY_TOKEN } from 'src/test/repository-token';
import { VerificationCodesRepository } from 'src/mail/verification-codes.repository';

describe('AuthService', () => {
  let authService: AuthService;
  let utilsService: UtilsService;
  let usersService: UsersService;
  let verificationCodesRepository: VerificationCodesRepository;

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
          provide: REPOSITORY_TOKEN.USERS,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: VerificationCodesRepository,
          useValue: { findOneByEmail: jest.fn() },
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
            findOneByEmail: jest.fn(),
            signUp: jest.fn(),
            register: jest.fn(),
            saveRefreshToken: jest.fn(),
            revokeRefreshToken: jest.fn(),
            updateLastLogin: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    utilsService = module.get<UtilsService>(UtilsService);
    usersService = module.get<UsersService>(UsersService);
    verificationCodesRepository = module.get<VerificationCodesRepository>(
      VerificationCodesRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(verificationCodesRepository).toBeDefined();
  });

  describe('validate user', () => {
    it('should succeed validating user', async () => {
      const user = seedSingleUser();

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(user);
      jest.spyOn(utilsService, 'compare').mockResolvedValue(true);
      const result = await authService.validateUser(user.email, user.password);

      expect(result).toBe(user);
    });

    it('should fail validating user when user does not exist', async () => {
      const user = seedSingleUser();
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(undefined);

      expect(
        authService.validateUser(user.email, user.password),
      ).rejects.toThrowError();
    });

    it('should fail validating when password is not matching', async () => {
      const user = seedSingleUser();

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(user);
      jest.spyOn(utilsService, 'compare').mockResolvedValue(false);

      expect(
        authService.validateUser(user.email, user.password),
      ).rejects.toThrowError();
    });
  });

  describe('login', () => {
    it('should succeed loggin in', async () => {
      const user = seedSingleUser();

      jest
        .spyOn(authService, 'createAccessToken')
        .mockReturnValue(jwtData().accessToken);

      jest
        .spyOn(authService, 'createRefreshToken')
        .mockReturnValue(jwtData().refreshToken);

      jest.spyOn(usersService, 'saveRefreshToken').mockResolvedValue();

      const result = await authService.login(user);

      expect(result).toEqual({
        access_token: jwtData().accessToken,
        refresh_token: jwtData().refreshToken,
        user,
      });
    });
  });
});
