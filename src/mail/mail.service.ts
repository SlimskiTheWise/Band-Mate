import { VerificationCodesRepository } from './verification-codes.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly verificationCodesRepository: VerificationCodesRepository,
  ) {}

  async sendVerificationCode(email: string) {
    try {
      // delete existing verification code data when the user requesting this agian
      const codeExists = await this.verificationCodesRepository.findOneByEmail(
        email,
      );
      if (codeExists) {
        this.verificationCodesRepository.deleteVerificationCode(codeExists.id);
      }

      const code: number = Math.round(Math.random() * 10000);
      await this.mailerService.sendMail({
        to: email,
        from: 'seunghoon@ziptoss.com',
        subject: 'Verification Code',
        html: `<p>Code: ${code}</p>`,
      });
      await this.verificationCodesRepository.createVerificationCode(
        code.toString(),
        email,
      );
    } catch (err) {
      console.log(err);
    }
  }

  async verifyVerificationCode(code: string, email: string): Promise<boolean> {
    const isVerified =
      await this.verificationCodesRepository.verifyVerificationCode(
        code,
        email,
      );

    if (!isVerified) throw new BadRequestException('wrong verification code');

    await this.verificationCodesRepository.updateVerificationCode(
      isVerified.id,
    );

    return true;
  }
}
