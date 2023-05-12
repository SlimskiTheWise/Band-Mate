import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SignupDto as SignUpDto } from './dtos/signup.dto';
import { Users } from './users.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ description: 'sign up' })
  @Post()
  async signUp(@Body() body: SignUpDto): Promise<Users> {
    return await this.usersService.signUp(body);
  }

  @ApiOperation({ description: 'find one user' })
  @Get(':email')
  async findOne(@Param('email') email: string) {
    return await this.usersService.findOneByEmail(email);
  }
}
