import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Payload } from '../interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService, private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwt,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: true,
      secretOrKey: config.get<string>('jwt.jwtSecret'),
    });
  }

  async validate(payload): Promise<Payload> {
    const currentTimestamp = new Date().getTime() / 1000;
    const tokenIsNotExpired = payload.exp > currentTimestamp;
    if (!tokenIsNotExpired)
      throw new UnauthorizedException('Access token has expired');
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
  }

  private static extractJwt(req: Request): string | null {
    const { access_token } = req.cookies;
    if (!access_token) throw new UnauthorizedException();
    return access_token;
  }
}
