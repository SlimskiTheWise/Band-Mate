import { ApiProperty } from '@nestjs/swagger';
import { Type } from '../type.enum';

export class CreateUserInterestsDto {
  @ApiProperty({
    name: 'types',
    example: [Type.BASS, Type.DRUMS],
    isArray: true,
    enum: Type,
  })
  types: Type[];
}
