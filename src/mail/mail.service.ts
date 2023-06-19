import { VerificationCodesRepository } from './verification-codes.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { VerificationDto } from 'src/auth/dtos/verification.dto';
import { VerificationCreateDto } from 'src/auth/dtos/verification.create.dto';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly verificationCodesRepository: VerificationCodesRepository,
  ) {}

  async sendVerificationCode({ email, type }: VerificationCreateDto) {
    try {
      // delete existing verification code data when the user requesting this agian
      const codeExists = await this.verificationCodesRepository.findOne(
        email,
        type,
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
      await this.verificationCodesRepository.createVerificationCode({
        code: code.toString(),
        email,
        type,
      });
    } catch (err) {
      console.error(err);
    }
  }

  async verifyVerificationCode(body: VerificationDto): Promise<boolean> {
    const isVerified =
      await this.verificationCodesRepository.verifyVerificationCode(body);

    if (!isVerified) throw new BadRequestException('wrong verification code');

    await this.verificationCodesRepository.updateVerificationCode(
      isVerified.id,
    );

    return true;
  }
}
