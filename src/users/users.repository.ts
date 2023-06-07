import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async signUp(body: SignupDto) {
    return this.usersRepository.save(body);
  }

  async findOneByEmail(email: string): Promise<Users> {
    return this.usersRepository.findOneBy({ email });
  }

  async findOneById(id: number): Promise<Users> {
    return this.usersRepository.findOneBy({ id });
  }

  async saveRefreshToken(userId: number, refresh_token: string) {
    await this.usersRepository.update(userId, { refreshToken: refresh_token });
  }

  async revokeRefreshToken(userId: number) {
    await this.usersRepository.update(userId, { refreshToken: '' });
  }

  async findOneByUsername(username: string): Promise<Users> {
    return this.usersRepository.findOneBy({ username });
  }

  async updateLastLogin(userId: number) {
    return this.usersRepository.update(userId, { lastLogin: new Date() });
  }
}
