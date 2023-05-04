import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { UtilsService } from 'src/utils/utils.service';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dtos/signup.dto';
import { Users } from './users.entity';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: UsersRepository;

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
          provide: UsersRepository,
          useValue: {
            signUp: jest.fn(),
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user: SignupDto = {
      email: 'test@test.com',
      password: 'password',
      name: 'test',
    };

    const newUser: Users = new Users();
    newUser.id = 1;
    newUser.password = 'encrypt';
    newUser.email = 'test@test.com';
    newUser.name = 'test';

    jest.spyOn(bcrypt, 'hash').mockImplementation(() => user.password);
    jest.spyOn(usersRepository, 'signUp').mockResolvedValue(newUser);
    const result = await service.signUp(user);

    expect(result.id).toBe(1);
  });
});
