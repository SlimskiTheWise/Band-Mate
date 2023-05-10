import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'invalid_email' })
  @IsNotEmpty()
  @ApiProperty({
    example: 'test@test.com',
  })
  email: string;

  @MinLength(4)
  @ApiProperty({
    example: 'string',
  })
  password: string;
}
