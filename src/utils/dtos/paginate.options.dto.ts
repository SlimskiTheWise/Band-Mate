import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { FindOptionsWhere, ObjectLiteral } from 'typeorm';

export class PaginateOptionsDto {
  @ApiPropertyOptional({ type: Number, default: 10 })
  @Type(() => Number)
  take = 10;

  @ApiPropertyOptional({ type: Number, default: 1 })
  @Type(() => Number)
  page = 1;

  @ApiPropertyOptional()
  @IsOptional()
  where?: FindOptionsWhere<ObjectLiteral>;
}
