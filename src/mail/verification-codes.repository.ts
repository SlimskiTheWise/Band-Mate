import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VerificationCodes } from './verification-codes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VerificationCodesRepository {
  constructor(
    @InjectRepository(VerificationCodes)
    private verificationCodesRepository: Repository<VerificationCodes>,
  ) {}

  async createVerificationCode(
    code: number,
    email: string,
  ): Promise<VerificationCodes> {
    return await this.verificationCodesRepository.save({ code, email });
  }

  async deleteVerificationCode(id: number): Promise<void> {
    await this.verificationCodesRepository.delete(id);
  }

  async verifyVerificationCode(
    code: number,
    email: string,
  ): Promise<VerificationCodes> {
    return await this.verificationCodesRepository.findOneBy({ code, email });
  }

  async updateVerificationCode(id: number): Promise<void> {
    await this.verificationCodesRepository.update({ id }, { isVerified: true });
  }

  async findOneByEmail(email: string): Promise<VerificationCodes> {
    return this.verificationCodesRepository.findOneBy({ email });
  }
}