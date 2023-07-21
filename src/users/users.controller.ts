import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersProfileResponse } from './responses/user-profile.response';

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
      const { key } = await this.awsService.uploadFileToS3(
        'test/profile',
        file,
      );
      body.profilePictureUrl = key;
    }
    return this.usersService.signUp(body);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profilePictureUrl: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ description: 'update profile picture' })
  @Post('/profile-picture')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profilePictureUrl'))
  async updateProfilePicture(
    @Req() { user }: { user: Users },
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    const { key } = await this.awsService.uploadFileToS3('test', file);

    await this.usersService.updateProfilePicture(user.id, key);
  }

  @ApiOperation({ summary: 'user profile detail' })
  @Get(':userId')
  async getUserProfileById(
    @Param('userId') userId: number,
  ): Promise<UsersProfileResponse> {
    return this.usersService.getUserProfileById(userId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'users counts' })
  @Get('counts')
  async getUsersCounts(): Promise<UsersCountsResponse> {
    return this.usersService.getUsersCounts();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ description: 'find one user' })
  @Get(':email')
  async findOne(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
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
