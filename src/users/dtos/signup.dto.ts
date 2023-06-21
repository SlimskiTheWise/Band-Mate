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

  @ApiProperty({ description: 'username', type: 'string', nullable: false })
  @IsString()
  username: string;

  @ApiProperty({ description: 'name', type: 'string', example: 'Dimitry Kim' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'role',
    type: 'string',
    nullable: true,
    example: 'user',
  })
  @IsString()
  @IsOptional()
  role?: Role;

  @ApiProperty({ type: 'string', format: 'binary', nullable: true })
  profilePictureUrl?: string;
}
