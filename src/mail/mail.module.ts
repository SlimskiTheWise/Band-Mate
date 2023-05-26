import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { VerificationCodesRepository } from './verification-codes.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationCodes } from './verification-codes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationCodes]),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          auth: {
            user: configService.get<string>('mail.user'),
            pass: configService.get<string>('mail.password'),
          },
        },
        defaults: {
          from: '"no-reply <projectm@gmail.com>"',
        },
        template: {
          dir: process.cwd() + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService, VerificationCodesRepository],
  exports: [MailService, VerificationCodesRepository],
})
export class MailModule {}
