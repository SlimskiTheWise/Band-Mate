import { ConfigService } from '@nestjs/config';
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
import { VerificationCreateDto } from './dtos/verification.create.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,
    private configService: ConfigService,
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
    return { success: true };
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
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @ApiOperation({ summary: 'google login' })
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async googleLogin(): Promise<void> {
    //calls back google/redirect
  }

  @ApiOperation({ summary: 'google redirect' })
  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  @HttpCode(HttpStatus.OK)
  async googleRedirect(
    @Req() { user }: { user: GoogleUser },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.googleLogin(
      user,
    );
    this.authService.storeTokenInCookie(res, { access_token, refresh_token });
    res.redirect(this.configService.get<string>('domain'));
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
        type: { type: 'string', example: 'password-reset' },
      },
    },
  })
  @ApiOperation({ description: 'send verification code via email' })
  @Post('/send-verification-code')
  async sendVerificationCode(@Body() body: VerificationCreateDto) {
    await this.mailService.sendVerificationCode(body);
  }

  @ApiOperation({ description: 'verify email' })
  @Post('/verify')
  async verifyVerificationCode(
    @Body() body: VerificationDto,
  ): Promise<boolean> {
    return await this.mailService.verifyVerificationCode(body);
  }
}
