import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserInterestsService } from './user-interests.service';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserInterestsDto } from './dtos/create-user-interests.dto';
import { Users } from 'src/users/users.entity';

@Controller('user-interests')
@ApiTags('User Interests')
@UseGuards(JwtAuthGuard)
export class UserInterestsController {
  constructor(private userInterestsService: UserInterestsService) {}

  @ApiOperation({ summary: 'create user interests' })
  @Post('user-interests')
  async createUserInterests(
    @Body() { types }: CreateUserInterestsDto,
    @Req() { user }: { user: Users },
  ) {
    await this.userInterestsService.createUserInterests(types, user.id);
  }
}
