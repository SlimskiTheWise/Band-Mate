import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';
import { Payload } from './interfaces/payload.interface';
import { ConfigService } from '@nestjs/config';
import { GoogleUser } from './interfaces/google.user.interface';
import { Users } from 'src/users/users.entity';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private utilsService: UtilsService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    const isPasswordMatching = await this.utilsService.compare(
      password,
      user.password,
    );
    if (!isPasswordMatching) throw new NotFoundException('User not found');
    return user;
  }

  async login(user: Users) {
    const payload: Payload = {
      name: user.name,
      id: user.id,
      email: user.email,
      role: user.role,
    };
    await this.usersService.updateLastLogin(user.id);
    const access_token = this.createAccessToken(payload);
    const refresh_token = this.createRefreshToken(payload);
    await this.usersService.saveRefreshToken(user.id, refresh_token);
    return { access_token, refresh_token, user };
  }

  async signout(user: Users) {
    await this.usersService.revokeRefreshToken(user.id);
  }

  async refreshAccessToken(refresh_token: string) {
    const decodedToken = this.jwtService.decode(refresh_token);
    return this.createAccessToken({
      id: decodedToken['id'],
      email: decodedToken['email'],
      name: decodedToken['name'],
      role: decodedToken['role'],
    });
  }

  createAccessToken(payload: Payload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.jwtSecret'),
      expiresIn: this.configService.get<string>('jwt.atkExpiresIn'),
    });
  }

  createRefreshToken(payload: Payload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshTokenSecret'),
      expiresIn: this.configService.get<string>('jwt.rtkExpiresIn'),
    });
  }

  async googleLogin(user: GoogleUser) {
    const userExists = await this.usersService.findOneByEmail(user.email);
    const newUser = !userExists ? await this.signupGoogleUser(user) : undefined;
    return this.login(newUser || userExists);
  }

  async signupGoogleUser(user: GoogleUser): Promise<Users> {
    return await this.usersService.signupGoogleUser(user);
  }

  storeTokenInCookie(res: Response, { access_token, refresh_token }) {
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
    });
  }
}
