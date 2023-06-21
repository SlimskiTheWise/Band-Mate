import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginateOptionsDto {
  @ApiPropertyOptional({ type: Number, default: 10 })
  @Type(() => Number)
  take = 10;

  @ApiPropertyOptional({ type: Number, default: 1 })
  @Type(() => Number)
  page = 1;
}
