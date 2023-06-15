import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SignupDto as SignUpDto } from './dtos/signup.dto';
import { Users } from './users.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';
import { UsersCountsResponse } from './responses/users-counts.dto';
import { AdminGuard } from 'src/auth/guards/admin-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly awsService: AwsService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiOperation({ description: 'sign up' })
  @Post()
  @UseInterceptors(FileInterceptor('profilePictureUrl'))
  async signUp(
    @Body() body: SignUpDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Users> {
    if (file) {
      const { key } = await this.awsService.uploadFileToS3('test', file);
      body.profilePictureUrl = key;
    }
    return await this.usersService.signUp(body);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'users counts' })
  @Get('counts')
  async getUsersCounts(): Promise<UsersCountsResponse> {
    return await this.usersService.getUsersCounts();
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ description: 'find one user' })
  @Get(':email')
  async findOne(@Param('email') email: string) {
    return await this.usersService.findOneByEmail(email);
  }

  @ApiBody({
    schema: {
      properties: {
        password: { type: 'string', example: '000000' },
        email: { type: 'string', example: 'seunghoon@ziptoss.com' },
      },
    },
  })
  @ApiOperation({ summary: 'password reset' })
  @Post('password-reset')
  async passwordReset(@Body() { password, email }): Promise<void> {
    await this.usersService.passwordReset(password, email);
  }
}
