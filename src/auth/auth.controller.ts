import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth-guard';
import { GoogleUser } from './interfaces/google.user.interface';
import { Users } from 'src/users/users.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string', example: 'test@test.com' },
        password: { type: 'string' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { access_token, refresh_token, user } = await this.authService.signIn(
      req.user as Users,
    );
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
    });
    return { userId: user.id, access_token };
  }

  @Get('refresh-token')
  async refreshAccessToken(@Req() req: Request) {
    return {
      access_token: await this.authService.refreshAccessToken(
        req.cookies.refresh_token,
      ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'google redirect' })
  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  async googleRedirect(@Req() req: Request) {
    await this.authService.googleSignin(req.user as GoogleUser);
    return { msg: 'success' };
  }
}
