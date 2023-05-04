import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';
import { Payload } from './interfaces/payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private utilsService: UtilsService,
    private jwtService: JwtService,
    private configService: ConfigService,
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
    const access_token = this.createAccessToken(payload);
    const refresh_token = this.createRefreshToken(payload);
    await this.usersService.saveRefreshToken(user.id, refresh_token);
    return { access_token, refresh_token, user };
  }

  async signout(userId: number) {
    await this.usersService.revokeRefreshToken(userId);
  }

  async refreshAccessToken(refresh_token: string) {
    const decodedToken = this.jwtService.decode(refresh_token);
    return this.createAccessToken({
      id: decodedToken['id'],
      email: decodedToken['email'],
      name: decodedToken['name'],
    });
  }

  createAccessToken(payload: Payload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.jtwSecret'),
      expiresIn: this.configService.get<string>('jwt.atkExpiresIn'),
    });
  }

  createRefreshToken(payload: Payload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshTokenSecret'),
      expiresIn: this.configService.get<string>('jwt.rtkExpiresIn'),
    });
  }
}
