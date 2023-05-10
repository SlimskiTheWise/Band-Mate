import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class SignupDto {
  @IsEmail({}, { message: 'invalid_email' })
  @IsNotEmpty()
  @ApiProperty({
    example: 'test@test.com',
    description: 'user email',
    type: 'string',
  })
  email: string;

  @ApiProperty({ description: 'password', type: 'string' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'name', type: 'string' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'role', type: 'string' })
  @IsString()
  @IsOptional()
  role?: Role;
}
