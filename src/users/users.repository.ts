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

  async findOne(email: string): Promise<Users> {
    return this.usersRepository.findOneBy({ email });
  }
}
