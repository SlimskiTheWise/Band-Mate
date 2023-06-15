import { VerificationCodesRepository } from './../mail/verification-codes.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { UtilsService } from 'src/utils/utils.service';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dtos/signup.dto';
import { Users } from './users.entity';
import { Role } from 'src/common/enums/role.enum';
import { seedSingleUser } from 'src/test/mock-data/user-mock-data';
import { VerificationCodes } from 'src/mail/verification-codes.entity';
import { Type } from 'src/mail/enums/type.enum';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: UsersRepository;
  let verificationCodesRepository: VerificationCodesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
      providers: [
        UsersService,
        {
          provide: VerificationCodesRepository,
          useValue: { findOne: jest.fn() },
        },
        {
          provide: UsersRepository,
          useValue: {
            signUp: jest.fn(),
            findOneByEmail: jest.fn(),
            findOneByUsername: jest.fn(),
          },
        },
        {
          provide: UtilsService,
          useValue: {
            compare: jest.fn(),
            encrypt: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    verificationCodesRepository = module.get<VerificationCodesRepository>(
      VerificationCodesRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user: SignupDto = {
      email: 'test@test.com',
      password: 'password',
      username: 'username',
      name: 'test',
      role: Role.USER,
    };

    const verifCode: VerificationCodes = {
      id: 1,
      email: 'test@test.com',
      code: '1232',
      type: Type.SIGNUP,
      isVerified: true,
    };

    const newUser: Users = seedSingleUser();

    jest
      .spyOn(verificationCodesRepository, 'findOne')
      .mockResolvedValue(verifCode);
    jest.spyOn(usersRepository, 'findOneByEmail').mockReturnValue(undefined);
    jest.spyOn(usersRepository, 'findOneByUsername').mockReturnValue(undefined);
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => user.password);
    jest.spyOn(usersRepository, 'signUp').mockResolvedValue(newUser);
    const result = await service.signUp(user);

    expect(result.id).toBe(1);
  });
});
