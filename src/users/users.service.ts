import { Injectable } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { Users } from './users.entity';
import { UsersRepository } from './users.repository';
import { UtilsService } from 'src/utils/utils.service';
import { GoogleUser } from 'src/auth/interfaces/google.user.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly utilsService: UtilsService,
  ) {}

  async signUp(body: SignupDto): Promise<Users> {
    const { password, ...rest } = body;
    const hashedPassword = await this.utilsService.encrypt(password);
    return this.usersRepository.signUp({ password: hashedPassword, ...rest });
  }

  async findOneByEmail(email: string): Promise<Users> {
    return this.usersRepository.findOneByEmail(email);
  }

  async findOneById(id: number): Promise<Users> {
    return this.usersRepository.findOneById(id);
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
}
