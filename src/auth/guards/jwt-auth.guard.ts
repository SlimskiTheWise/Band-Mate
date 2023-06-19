import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService, private config: ConfigService) {
    super();
  }
  public canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const access_token = request.headers.cookie
      .split(' ')
      .find((cookie) => cookie.includes('access_token'))
      ?.split('=')[1];
    request.user = this.validateToken(access_token);
    return true;
  }

  validateToken(token: string) {
    try {
      const verify = this.jwtService.verify(token, {
        secret: this.config.get<string>('jwt.jwtSecret'),
      });
      return verify;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        //todo define error message somewhere
        throw new UnauthorizedException('Access token has expired');
      }
    }
  }
}
