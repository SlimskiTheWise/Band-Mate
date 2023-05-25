import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class VerificationDto {
  @IsEmail({}, { message: 'invalid_email' })
  @IsNotEmpty()
  @ApiProperty({
    example: 'test@test.com',
  })
  email: string;

  @MinLength(4)
  @ApiProperty({
    example: 1212,
  })
  code: number;
}
