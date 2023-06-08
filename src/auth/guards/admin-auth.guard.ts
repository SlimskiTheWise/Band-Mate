import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.access_token;
    const user = this.jwtService.decode(token) as { role: Role };
    if (!token || user.role !== Role.ADMIN) throw new UnauthorizedException();
    return true;
  }
}
