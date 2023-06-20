import { ApiTags } from '@nestjs/swagger';
import { UserInterestsService } from './user-interests.service';
import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user-interests')
@ApiTags('User Interests')
@UseGuards(JwtAuthGuard)
export class UserInterestsController {
  constructor(private userInterestsService: UserInterestsService) {}
}
