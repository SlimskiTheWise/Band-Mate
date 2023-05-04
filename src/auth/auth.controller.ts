import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { SignInDto } from './dtos/signIn.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: SignInDto,
  ) {
    const { access_token, refresh_token, user } = await this.authService.signIn(
      req.user,
    );
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
    });
    return { userId: user.id, access_token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
