import { VerificationCodesRepository } from './../mail/verification-codes.repository';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { Users } from './users.entity';
import { UsersRepository } from './users.repository';
import { UtilsService } from 'src/utils/utils.service';
import { GoogleUser } from 'src/auth/interfaces/google.user.interface';
import { Type } from 'src/mail/enums/type.enum';
import { UsersProfileResponse } from './responses/user-profile.response';
import { UsersCountsResponse } from './responses/users-counts.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly utilsService: UtilsService,
    private readonly verificationCodesRepository: VerificationCodesRepository,
  ) {}

  async signUp(body: SignupDto): Promise<Users> {
    const { password, ...rest } = body;

    const verifCode = await this.verificationCodesRepository.findOne(
      rest.email,
    );

    if (!verifCode || !verifCode.isVerified)
      throw new BadRequestException('verify email');

    const emailExists = await this.usersRepository.findOneByEmail(rest.email);
    if (emailExists) throw new ConflictException('Email already exists');

    const usernameExists = await this.usersRepository.findOneByUsername(
      rest.username,
    );
    if (usernameExists) throw new ConflictException('Username already exists');

    const hashedPassword = await this.utilsService.encrypt(password);
    return this.usersRepository.signUp({ password: hashedPassword, ...rest });
  }

  async findOneByEmail(email: string): Promise<Users> {
    return this.usersRepository.findOneByEmail(email);
  }

  async findOneById(id: number): Promise<Users> {
    return this.usersRepository.findOneById(id);
  }

  async findOneByUsername(username: string): Promise<Users> {
    return this.usersRepository.findOneByUsername(username);
  }

  async saveRefreshToken(userId: number, refresh_token: string) {
    return this.usersRepository.saveRefreshToken(userId, refresh_token);
  }

  async revokeRefreshToken(userId: number) {
    return this.usersRepository.revokeRefreshToken(userId);
  }

  async signupGoogleUser(user: GoogleUser): Promise<Users> {
    const { email, name } = user;
    // assign a random password since oauth user data does not have a password
    const hashedPassword = await this.utilsService.encrypt(
      Math.random().toString(36).slice(-8),
    );
    return this.usersRepository.signUp({
      email,
      name,
      password: hashedPassword,
    });
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.usersRepository.updateLastLogin(userId);
  }

  async getUsersCounts(): Promise<UsersCountsResponse> {
    return this.usersRepository.getUsersCounts();
  }

  async passwordReset(password: string, email: string): Promise<void> {
    const user = await this.usersRepository.findOneByEmail(email);

    const verifCode = await this.verificationCodesRepository.findOne(
      email,
      Type.PASSWORD_RESET,
    );

    if (!verifCode || !verifCode.isVerified) {
      throw new BadRequestException('verify email');
    }

    const hashedPassword = await this.utilsService.encrypt(password);
    await this.usersRepository.passwordReset(user.id, hashedPassword);
  }

  async getUserProfileById(userId: number): Promise<UsersProfileResponse> {
    return this.usersRepository.getUserProfileById(userId);
  }
}
