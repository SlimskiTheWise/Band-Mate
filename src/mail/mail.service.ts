import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationCode(email: string) {
    try {
      const verificationCode: number = Math.round(Math.random() * 10000);
      await this.mailerService.sendMail({
        to: email,
        from: 'seunghoon@ziptoss.com',
        subject: 'Verification Code',
        html: `<p>Code: ${verificationCode}</p>`,
      });
      return verificationCode;
    } catch (err) {
      console.log(err);
    }
  }
}
