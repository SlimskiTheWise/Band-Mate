import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FollowersService } from './followers.service';
import { Request } from 'express';
import { Users } from 'src/users/users.entity';

@Controller('followers')
@UseGuards(JwtAuthGuard)
@ApiTags('Followers')
export class FollowersController {
  constructor(private followersService: FollowersService) {}

  @ApiOperation({ summary: 'loggedin user following another user' })
  @Post(':followedUserId')
  async createFollower(
    @Req() { user }: { user: Users },
    @Param('followedUserId', ParseIntPipe) followedUserId: number,
  ): Promise<void> {
    await this.followersService.createFollower(user.id, followedUserId);
  }
}
