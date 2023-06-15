import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Type } from 'src/mail/enums/type.enum';

export class VerificationCreateDto {
  @IsEmail({}, { message: 'invalid_email' })
  @IsNotEmpty()
  @ApiProperty({
    example: 'test@test.com',
  })
  email: string;

  @ApiProperty({ example: 'signup', type: String })
  type: Type;
}
