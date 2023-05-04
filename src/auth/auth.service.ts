import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';
import { Payload } from './interfaces/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private utilsService: UtilsService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (!this.utilsService.compare(password, user.password)) {
      throw new BadRequestException();
    }
    return user;
  }

  async signIn(user: any) {
    const payload: Payload = {
      name: user.name,
      id: user.id,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
