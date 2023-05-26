import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth-guard';
import { GoogleUser } from './interfaces/google.user.interface';
import { Users } from 'src/users/users.entity';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { MailService } from 'src/mail/mail.service';
import { VerificationDto } from './dtos/verification.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,
  ) {}
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
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { access_token, refresh_token } = await this.authService.login(
      req.user as Users,
    );
    this.authService.storeTokenInCookie(res, { access_token, refresh_token });
    res.send({ success: true });
    return;
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh-token')
  async refreshAccessToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refresh_token = req.cookies.refresh_token;
    const access_token = await this.authService.refreshAccessToken(
      refresh_token,
    );
    this.authService.storeTokenInCookie(res, { access_token, refresh_token });
    res.send({ success: true });
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiCookieAuth()
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @ApiOperation({ summary: 'google redirect' })
  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  @HttpCode(HttpStatus.OK)
  async googleRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.googleLogin(
      req.user as GoogleUser,
    );
    this.authService.storeTokenInCookie(res, { access_token, refresh_token });
    res.send({ success: true });
    return;
  }

  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'logout' })
  @ApiCookieAuth()
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    this.authService.signout(req.user as Users);
    res.send({ success: true });
  }

  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string', example: 'test@test.com' },
      },
    },
  })
  @ApiOperation({ description: 'send verification code via email' })
  @Post('/send-verification-code:email')
  async sendVerificationCode(@Param('email') email: string) {
    await this.mailService.sendVerificationCode(email);
  }

  @ApiOperation({ description: 'verify email' })
  @Post('/verify')
  async verifyVerificationCode(
    @Body() { email, code }: VerificationDto,
  ): Promise<boolean> {
    return await this.mailService.verifyVerificationCode(code, email);
  }
}
