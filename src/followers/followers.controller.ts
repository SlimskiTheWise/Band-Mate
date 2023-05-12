import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FollowersService } from './followers.service';

@Controller('followers')
@UseGuards(JwtAuthGuard)
@ApiTags('Followers')
export class FollowersController {
  constructor(private followersService: FollowersService) {}
}
