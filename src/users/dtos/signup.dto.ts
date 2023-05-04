import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupDto {
  @IsEmail({}, { message: 'invalid_email' })
  @IsNotEmpty()
  @ApiProperty({
    example: 'test@test.com',
    description: 'user email',
    type: 'string'
  })
  email: string;

  @ApiProperty({ description: 'password', type: 'string' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'name', type: 'string' })
  @IsString()
  name: string;
}