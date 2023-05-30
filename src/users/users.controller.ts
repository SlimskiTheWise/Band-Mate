import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SignupDto as SignUpDto } from './dtos/signup.dto';
import { Users } from './users.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';

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

  @ApiOperation({ description: 'find one user' })
  @Get(':email')
  async findOne(@Param('email') email: string) {
    return await this.usersService.findOneByEmail(email);
  }
}
