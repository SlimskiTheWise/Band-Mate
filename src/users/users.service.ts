import { Injectable } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { Users } from './users.entity';
import { UsersRepository } from './users.repository';
import { UtilsService } from 'src/utils/utils.service';

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

  async findOne(email: string): Promise<Users> {
    return this.usersRepository.findOne(email);
  }

  async saveRefreshToken(userId: number, refresh_token: string) {
    return this.usersRepository.saveRefreshToken(userId, refresh_token);
  }

  async revokeRefreshToken(userId: number) {
    return this.usersRepository.revokeRefreshToken(userId);
  }
}
