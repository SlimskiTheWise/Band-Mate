import { ApiProperty } from '@nestjs/swagger';

export class CreateInstrumentCommentDto {
  @ApiProperty({
    name: 'content',
    example: 'leaving a comment',
    nullable: false,
    type: 'string',
  })
  content: string;
}
