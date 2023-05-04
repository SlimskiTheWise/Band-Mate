import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilsService {
  constructor(private configService: ConfigService) {}

  async encrypt(plainText: string): Promise<string> {
    const salt = await bcrypt.genSalt(
      Number(this.configService.get<number>('bcrypt.salt')),
    );
    return await bcrypt.hash(plainText, salt);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
