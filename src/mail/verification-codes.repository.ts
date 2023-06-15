import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VerificationCodes } from './verification-codes.entity';
import { Repository } from 'typeorm';
import { VerificationDto } from 'src/auth/dtos/verification.dto';
import { Type } from './enums/type.enum';

@Injectable()
export class VerificationCodesRepository {
  constructor(
    @InjectRepository(VerificationCodes)
    private verificationCodesRepository: Repository<VerificationCodes>,
  ) {}

  async createVerificationCode({
    code,
    email,
    type,
  }: VerificationDto): Promise<VerificationCodes> {
    return await this.verificationCodesRepository.save({ code, email, type });
  }

  async deleteVerificationCode(id: number): Promise<void> {
    await this.verificationCodesRepository.delete(id);
  }

  async verifyVerificationCode(
    body: VerificationDto,
  ): Promise<VerificationCodes> {
    return await this.verificationCodesRepository.findOneBy(body);
  }

  async updateVerificationCode(id: number): Promise<void> {
    await this.verificationCodesRepository.update({ id }, { isVerified: true });
  }

  async findOne(email: string, type = Type.SIGNUP): Promise<VerificationCodes> {
    return this.verificationCodesRepository.findOneBy({ email, type });
  }
}
